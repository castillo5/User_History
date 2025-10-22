import { Request, Response } from 'express';
import { ClientService } from '@modules/clients/services/ClientService';
import { CreateClientDto } from '@modules/clients/dto/CreateClientDto';
import { UpdateClientDto } from '@modules/clients/dto/UpdateClientDto';

export class ClientController {
  constructor(private readonly service = new ClientService()) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateClientDto;
    const client = await this.service.create(dto);
    res.status(201).json({ client });
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const clients = await this.service.findAll();
    res.status(200).json({ clients });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const client = await this.service.findById(req.params.id);
    res.status(200).json({ client });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateClientDto;
    const client = await this.service.update(req.params.id, dto);
    res.status(200).json({ client });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.service.delete(req.params.id);
    res.status(204).send();
  };
}
