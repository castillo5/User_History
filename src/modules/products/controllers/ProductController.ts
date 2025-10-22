import { Request, Response } from 'express';
import { ProductService } from '@modules/products/services/ProductService';
import { CreateProductDto } from '@modules/products/dto/CreateProductDto';
import { UpdateProductDto } from '@modules/products/dto/UpdateProductDto';

export class ProductController {
  constructor(private readonly service = new ProductService()) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateProductDto;
    const product = await this.service.create(dto);
    res.status(201).json({ product });
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const products = await this.service.findAll();
    res.status(200).json({ products });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const product = await this.service.findById(req.params.id);
    res.status(200).json({ product });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateProductDto;
    const product = await this.service.update(req.params.id, dto);
    res.status(200).json({ product });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.service.delete(req.params.id);
    res.status(204).send();
  };
}
