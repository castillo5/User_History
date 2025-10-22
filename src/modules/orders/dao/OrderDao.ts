import { FindOptions, Includeable, Transaction } from 'sequelize';
import { Order, OrderCreationAttributes, OrderStatus } from '@modules/orders/models/Order';
import { OrderProduct, OrderProductCreationAttributes } from '@modules/orders/models/OrderProduct';
import { Product } from '@modules/products/models/Product';
import { Client } from '@modules/clients/models/Client';
import { User } from '@modules/users/models/User';

const baseItemsInclude = {
  model: OrderProduct,
  as: 'items',
  include: [{ model: Product, as: 'product' }]
} as Includeable;

const defaultInclude: Includeable[] = [
  { model: Client, as: 'cliente' },
  { model: User, as: 'usuario', attributes: ['id', 'nombre', 'email', 'rol'] },
  baseItemsInclude
];

export class OrderDao {
  createOrder(data: OrderCreationAttributes, transaction: Transaction): Promise<Order> {
    return Order.create(data, { transaction });
  }

  bulkCreateItems(data: OrderProductCreationAttributes[], transaction: Transaction): Promise<OrderProduct[]> {
    return OrderProduct.bulkCreate(data, { transaction });
  }

  updateOrder(order: Order, transaction: Transaction): Promise<Order> {
    return order.save({ transaction });
  }

  findById(id: string, options: FindOptions<Order> = {}): Promise<Order | null> {
    return Order.findByPk(id, { include: defaultInclude, ...options });
  }

  list(options: FindOptions<Order> = {}): Promise<Order[]> {
    return Order.findAll({ include: defaultInclude, order: [['fecha', 'DESC']], ...options });
  }

  findByCliente(clienteId: string): Promise<Order[]> {
    return this.list({ where: { clienteId } });
  }

  findByProducto(productoId: string): Promise<Order[]> {
    const include: Includeable[] = [
      { model: Client, as: 'cliente' },
      { model: User, as: 'usuario', attributes: ['id', 'nombre', 'email', 'rol'] },
      {
        model: OrderProduct,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
        where: { productId: productoId }
      }
    ];
    return this.list({ include });
  }

  updateStatus(orderId: string, status: OrderStatus): Promise<[number]> {
    return Order.update({ estado: status }, { where: { id: orderId } });
  }

  findByFilters(filters: { clienteId?: string; productoId?: string; estado?: OrderStatus }, limit?: number, offset?: number): Promise<Order[]> {
    const include: Includeable[] = [
      { model: Client, as: 'cliente' },
      { model: User, as: 'usuario', attributes: ['id', 'nombre', 'email', 'rol'] },
      {
        model: OrderProduct,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
        ...(filters.productoId ? { where: { productId: filters.productoId } } : {})
      }
    ];

    return this.list({
      where: {
        ...(filters.clienteId ? { clienteId: filters.clienteId } : {}),
        ...(filters.estado ? { estado: filters.estado } : {})
      },
      include,
      limit,
      offset
    });
  }
}
