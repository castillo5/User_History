import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { HttpError } from '@utils/HttpError';

const parseRequest = <T>(schema: ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError(400, 'Validación fallida', error.flatten());
    }
    throw error;
  }
};

export const validateRequest = <T>(schema: ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = parseRequest(schema, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = <T>(schema: ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = parseRequest(schema, req.query) as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};
