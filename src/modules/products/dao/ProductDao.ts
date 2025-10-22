import { FindOptions, Op } from 'sequelize';
import { Product, ProductCreationAttributes } from '@modules/products/models/Product';

export class ProductDao {
  create(data: ProductCreationAttributes): Promise<Product> {
    return Product.create(data);
  }

  findById(id: string): Promise<Product | null> {
    return Product.findByPk(id);
  }

  findByCodigo(codigo: string): Promise<Product | null> {
    return Product.findOne({ where: { codigo } });
  }

  list(options: FindOptions<Product> = {}): Promise<Product[]> {
    return Product.findAll({ order: [['nombre', 'ASC']], ...options });
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }
    return product.update(data);
  }

  delete(id: string): Promise<number> {
    return Product.destroy({ where: { id } });
  }

  decrementStock(productId: string, quantity: number): Promise<[affectedCount: number]> {
    return Product.update(
      { stock: Product.sequelize!.literal(`GREATEST(stock - ${quantity}, 0)`) },
      { where: { id: productId, stock: { [Op.gte]: quantity } } }
    );
  }
}
