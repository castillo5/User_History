import { Transaction } from 'sequelize';
import { sequelize } from '@config/database';
import { decryptHybrid, encryptHybrid } from '@config/crypto';
import { HttpError } from '@utils/HttpError';
import { Order, OrderStatus } from '@modules/orders/models/Order';
import { OrderDao } from '@modules/orders/dao/OrderDao';
import { Product } from '@modules/products/models/Product';
import { Client } from '@modules/clients/models/Client';
import { CreateOrderDto, OrderItemInput } from '@modules/orders/dto/CreateOrderDto';
import { QueryOrderDto } from '@modules/orders/dto/QueryOrderDto';

export class OrderService {
  constructor(private readonly orderDao = new OrderDao(), private readonly sequelizeInstance = sequelize) {}

  async create(usuarioId: string, dto: CreateOrderDto): Promise<Order> {
    return this.sequelizeInstance.transaction(async (transaction) => {
      const client = await Client.findByPk(dto.clienteId, { transaction });
      if (!client) {
        throw new HttpError(404, 'Cliente no encontrado');
      }

      const products = await this.loadProducts(dto.items, transaction);
      const total = this.calculateTotal(dto.items, products);

      const order = await this.orderDao.createOrder(
        {
          clienteId: dto.clienteId,
          usuarioId,
          estado: dto.estado ?? 'pendiente',
          total
        },
        transaction
      );

      const orderItems = dto.items.map((item) => {
        const product = products.get(item.productId)!;
        return {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          priceAtSale: Number(product.precio)
        };
      });

      await this.orderDao.bulkCreateItems(orderItems, transaction);

      await this.updateStock(dto.items, transaction);

      if (dto.sensitiveData) {
        const hybridPayload = await encryptHybrid(dto.sensitiveData);
        order.encryptedDetails = hybridPayload.ciphertext;
        order.encryptionIv = hybridPayload.iv;
        order.encryptionAuthTag = hybridPayload.authTag;
        order.encryptionKey = hybridPayload.encryptedKey;
      }

      await this.orderDao.updateOrder(order, transaction);

      await order.reload({
        include: [
          { association: 'cliente' },
          { association: 'usuario', attributes: ['id', 'nombre', 'email', 'rol'] },
          { association: 'items', include: [{ association: 'product' }] }
        ],
        transaction
      });

      return order;
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderDao.findById(id);
    if (!order) {
      throw new HttpError(404, 'Pedido no encontrado');
    }
    return order;
  }

  list(query: QueryOrderDto): Promise<Order[]> {
    const { clienteId, productoId, estado, limit, offset } = query;
    return this.orderDao.findByFilters({ clienteId, productoId, estado }, limit, offset);
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.findById(orderId);
    order.estado = status;
    await order.save();
    await order.reload({
      include: [
        { association: 'cliente' },
        { association: 'usuario', attributes: ['id', 'nombre', 'email', 'rol'] },
        { association: 'items', include: [{ association: 'product' }] }
      ]
    });
    return order;
  }

  async getSensitiveData(orderId: string): Promise<unknown> {
    const order = await this.findById(orderId);
    if (!order.encryptedDetails || !order.encryptionIv || !order.encryptionAuthTag || !order.encryptionKey) {
      throw new HttpError(404, 'Pedido no tiene datos sensibles almacenados');
    }

    const payload = await decryptHybrid({
      ciphertext: order.encryptedDetails,
      iv: order.encryptionIv,
      authTag: order.encryptionAuthTag,
      encryptedKey: order.encryptionKey
    });
    return payload;
  }

  private async loadProducts(items: OrderItemInput[], transaction: Transaction): Promise<Map<string, Product>> {
    const ids = items.map((i) => i.productId);
    const products = await Product.findAll({ where: { id: ids }, transaction });
    if (products.length !== ids.length) {
      throw new HttpError(400, 'Uno o más productos no existen');
    }

    const map = new Map<string, Product>();
    products.forEach((product) => map.set(product.id, product));
    return map;
  }

  private calculateTotal(items: OrderItemInput[], products: Map<string, Product>): number {
    return items.reduce((acc, item) => {
      const product = products.get(item.productId);
      if (!product) {
        throw new HttpError(400, 'Producto no encontrado al calcular total');
      }
      return acc + Number(product.precio) * item.quantity;
    }, 0);
  }

  private async updateStock(items: OrderItemInput[], transaction: Transaction): Promise<void> {
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!product) {
        throw new HttpError(400, 'Producto no encontrado al actualizar stock');
      }
      if (product.stock < item.quantity) {
        throw new HttpError(400, `Stock insuficiente para producto ${product.nombre}`);
      }
      product.stock -= item.quantity;
      await product.save({ transaction });
    }
  }
}
