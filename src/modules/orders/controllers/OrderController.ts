import { Request, Response } from 'express';
import { OrderService } from '@modules/orders/services/OrderService';
import { CreateOrderDto } from '@modules/orders/dto/CreateOrderDto';
import { QueryOrderDto } from '@modules/orders/dto/QueryOrderDto';
import { OrderStatus } from '@modules/orders/models/Order';

export class OrderController {
  constructor(private readonly service = new OrderService()) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateOrderDto;
    const order = await this.service.create(req.user!.id, dto);
    res.status(201).json({ order });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as QueryOrderDto;
    const orders = await this.service.list(query);
    res.status(200).json({ orders });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const order = await this.service.findById(req.params.id);
    res.status(200).json({ order });
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const status = req.body.estado as OrderStatus;
    const order = await this.service.updateStatus(req.params.id, status);
    res.status(200).json({ order });
  };

  getSensitiveData = async (req: Request, res: Response): Promise<void> => {
    const data = await this.service.getSensitiveData(req.params.id);
    res.status(200).json({ data });
  };
}
