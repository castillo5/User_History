import { HttpError } from '@utils/HttpError';
import { Client } from '@modules/clients/models/Client';
import { ClientDao } from '@modules/clients/dao/ClientDao';
import { CreateClientDto } from '@modules/clients/dto/CreateClientDto';
import { UpdateClientDto } from '@modules/clients/dto/UpdateClientDto';

export class ClientService {
  constructor(private readonly dao = new ClientDao()) {}

  async create(dto: CreateClientDto): Promise<Client> {
    const existing = await this.dao.findByEmail(dto.email);
    if (existing) {
      throw new HttpError(409, 'Email de cliente ya registrado');
    }
    return this.dao.create(dto);
  }

  findAll(): Promise<Client[]> {
    return this.dao.list();
  }

  async findById(id: string): Promise<Client> {
    const client = await this.dao.findById(id);
    if (!client) {
      throw new HttpError(404, 'Cliente no encontrado');
    }
    return client;
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    if (dto.email) {
      const other = await this.dao.findByEmail(dto.email);
      if (other && other.id !== id) {
        throw new HttpError(409, 'Email de cliente ya registrado');
      }
    }
    const updated = await this.dao.update(id, dto as Partial<Client>);
    if (!updated) {
      throw new HttpError(404, 'Cliente no encontrado');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.dao.delete(id);
    if (!deleted) {
      throw new HttpError(404, 'Cliente no encontrado');
    }
  }
}
