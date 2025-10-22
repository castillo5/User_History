import { Request, Response } from 'express';
import healthService from '../services/health.service';

class HealthController {
  check = (_req: Request, res: Response) => {
    const payload = healthService.getServiceStatus();
    res.json(payload);
  };
}

export default new HealthController();
