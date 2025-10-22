import { Client, ClientCreationAttributes } from '@modules/clients/models/Client';

export class ClientDao {
  create(data: ClientCreationAttributes): Promise<Client> {
    return Client.create(data);
  }

  findById(id: string): Promise<Client | null> {
    return Client.findByPk(id);
  }

  findByEmail(email: string): Promise<Client | null> {
    return Client.findOne({ where: { email } });
  }

  list(): Promise<Client[]> {
    return Client.findAll({ order: [['nombre', 'ASC']] });
  }

  async update(id: string, data: Partial<Client>): Promise<Client | null> {
    const client = await this.findById(id);
    if (!client) {
      return null;
    }
    return client.update(data);
  }

  delete(id: string): Promise<number> {
    return Client.destroy({ where: { id } });
  }
}
