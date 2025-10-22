import { HttpError } from '@utils/HttpError';
import { Product } from '@modules/products/models/Product';
import { ProductDao } from '@modules/products/dao/ProductDao';
import { CreateProductDto } from '@modules/products/dto/CreateProductDto';
import { UpdateProductDto } from '@modules/products/dto/UpdateProductDto';

export class ProductService {
  constructor(private readonly dao = new ProductDao()) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.dao.findByCodigo(dto.codigo);
    if (existing) {
      throw new HttpError(409, 'Código de producto ya existente');
    }
    return this.dao.create(dto);
  }

  async findAll(): Promise<Product[]> {
    return this.dao.list();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.dao.findById(id);
    if (!product) {
      throw new HttpError(404, 'Producto no encontrado');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    if (dto.codigo) {
      const other = await this.dao.findByCodigo(dto.codigo);
      if (other && other.id !== id) {
        throw new HttpError(409, 'Código de producto ya existente');
      }
    }
    const updated = await this.dao.update(id, dto as Partial<Product>);
    if (!updated) {
      throw new HttpError(404, 'Producto no encontrado');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.dao.delete(id);
    if (!deleted) {
      throw new HttpError(404, 'Producto no encontrado');
    }
  }
}
