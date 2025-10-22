import { ProductService } from '@modules/products/services/ProductService';
import { HttpError } from '@utils/HttpError';
import { Product } from '@modules/products/models/Product';
import { CreateProductDto } from '@modules/products/dto/CreateProductDto';
import { UpdateProductDto } from '@modules/products/dto/UpdateProductDto';

const sampleProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'prod-id',
  nombre: 'Producto',
  codigo: 'COD-1',
  precio: 10,
  categoria: 'Test',
  stock: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
}) as Product;

describe('ProductService', () => {
  const dao = {
    create: jest.fn(),
    findByCodigo: jest.fn(),
    list: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  const service = new ProductService(dao as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a product when codigo is unique', async () => {
    const dto: CreateProductDto = {
      nombre: 'Nuevo',
      codigo: 'COD-2',
      precio: 12.5,
      categoria: 'Test',
      stock: 10
    };

    dao.findByCodigo.mockResolvedValue(null);
    dao.create.mockResolvedValue(sampleProduct({ codigo: dto.codigo }));

    const product = await service.create(dto);

    expect(dao.create).toHaveBeenCalledWith(dto);
    expect(product.codigo).toBe(dto.codigo);
  });

  it('throws when codigo already exists', async () => {
    const dto: CreateProductDto = {
      nombre: 'Nuevo',
      codigo: 'COD-1',
      precio: 12.5,
      categoria: 'Test',
      stock: 10
    };

    dao.findByCodigo.mockResolvedValue(sampleProduct({ codigo: dto.codigo }));

    await expect(service.create(dto)).rejects.toThrow(HttpError);
  });

  it('updates a product validating codigo uniqueness', async () => {
    const existing = sampleProduct();
    dao.findByCodigo.mockResolvedValueOnce(existing);
    dao.findByCodigo.mockResolvedValueOnce(null);
    dao.update.mockImplementation(async (_id: string, data: Partial<Product>) => sampleProduct({ ...existing, ...data }));

    const dto: UpdateProductDto = { codigo: 'COD-NEW', stock: 8 };
    const result = await service.update(existing.id, dto);

    expect(result.codigo).toBe('COD-NEW');
    expect(result.stock).toBe(8);
  });

  it('deletes a product when exists', async () => {
    dao.delete.mockResolvedValue(1);
    await expect(service.delete('prod-id')).resolves.toBeUndefined();
  });

  it('throws deleting a missing product', async () => {
    dao.delete.mockResolvedValue(0);
    await expect(service.delete('missing')).rejects.toThrow(HttpError);
  });
});
