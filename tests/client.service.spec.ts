import { ClientService } from '@modules/clients/services/ClientService';
import { HttpError } from '@utils/HttpError';
import { Client } from '@modules/clients/models/Client';
import { CreateClientDto } from '@modules/clients/dto/CreateClientDto';

const createClient = (overrides: Partial<Client> = {}): Client => ({
  id: 'client-id',
  nombre: 'Cliente',
  email: 'cliente@example.com',
  telefono: '1234567',
  direccion: 'Calle 1',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
}) as Client;

describe('ClientService', () => {
  const dao = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    list: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  const service = new ClientService(dao as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates client when email is unique', async () => {
    const dto: CreateClientDto = { nombre: 'Nuevo', email: 'nuevo@example.com', telefono: '7654321' };
    dao.findByEmail.mockResolvedValue(null);
    dao.create.mockResolvedValue(createClient({ email: dto.email }));

    const client = await service.create(dto);
    expect(client.email).toBe(dto.email);
    expect(dao.create).toHaveBeenCalled();
  });

  it('throws when email is duplicated', async () => {
    const dto: CreateClientDto = { nombre: 'Nuevo', email: 'cliente@example.com', telefono: '7654321' };
    dao.findByEmail.mockResolvedValue(createClient({ email: dto.email }));

    await expect(service.create(dto)).rejects.toThrow(HttpError);
  });

  it('updates client validating email uniqueness', async () => {
    const client = createClient();
    dao.findByEmail.mockResolvedValueOnce(client);
    dao.findByEmail.mockResolvedValueOnce(null);
    dao.update.mockImplementation(async (_id: string, data: Partial<Client>) => createClient({ ...client, ...data }));

    const result = await service.update(client.id, { email: 'nuevo@example.com' });
    expect(result.email).toBe('nuevo@example.com');
  });

  it('throws deleting non-existing client', async () => {
    dao.delete.mockResolvedValue(0);
    await expect(service.delete('missing')).rejects.toThrow(HttpError);
  });
});
