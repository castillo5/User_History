import { encryptHybrid } from '@config/crypto';
import { OrderService } from '@modules/orders/services/OrderService';
import { HttpError } from '@utils/HttpError';
import { Order } from '@modules/orders/models/Order';

const createOrder = (overrides: Partial<Order> = {}): Order => ({
  id: 'order-id',
  clienteId: 'client-id',
  usuarioId: 'user-id',
  fecha: new Date(),
  estado: 'pendiente',
  total: 0,
  encryptedDetails: null,
  encryptionIv: null,
  encryptionAuthTag: null,
  encryptionKey: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  save: jest.fn().mockResolvedValue(undefined),
  reload: jest.fn().mockResolvedValue(undefined),
  toJSON: jest.fn(),
  ...overrides
}) as unknown as Order;

describe('OrderService', () => {
  const orderDao = {
    findById: jest.fn(),
    findByFilters: jest.fn()
  };
  const sequelizeStub = { transaction: jest.fn() };
  const service = new OrderService(orderDao as any, sequelizeStub as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when order is not found', async () => {
    orderDao.findById.mockResolvedValue(null);
    await expect(service.findById('missing')).rejects.toThrow(HttpError);
  });

  it('returns orders by filter', async () => {
    const orders = [createOrder({ id: 'order-1' })];
    orderDao.findByFilters.mockResolvedValue(orders);
    const result = await service.list({ clienteId: 'client-id' } as any);
    expect(result).toEqual(orders);
    expect(orderDao.findByFilters).toHaveBeenCalledWith({ clienteId: 'client-id', productoId: undefined, estado: undefined }, undefined, undefined);
  });

  it('decrypts sensitive data successfully', async () => {
    const payload = { notasInternas: 'prioridad alta', pagoReferencia: 'PAY-123' };
    const encrypted = await encryptHybrid(payload);
    const order = createOrder({
      encryptedDetails: encrypted.ciphertext,
      encryptionIv: encrypted.iv,
      encryptionAuthTag: encrypted.authTag,
      encryptionKey: encrypted.encryptedKey
    });

    orderDao.findById.mockResolvedValue(order);

    const result = await service.getSensitiveData(order.id);
    expect(result).toEqual(payload);
  });
});
