import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    });
    return;
  }

  if (err instanceof Error) {
    console.error('Unexpected error:', err.message, err.stack);
  } else {
    console.error('Unexpected error:', err);
  }
  res.status(500).json({ message: 'Error interno del servidor' });
};
