import { Request, Response, NextFunction } from 'express';

export const requestLogger = (verbose = true) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!verbose) {
      return next();
    }
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
  };
};
