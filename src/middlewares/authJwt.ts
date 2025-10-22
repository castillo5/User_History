import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@config/env';
import { HttpError } from '@utils/HttpError';

interface JwtPayload {
  sub: string;
  email: string;
  rol: 'admin' | 'vendedor';
  iat: number;
  exp: number;
}

export const authenticateJwt = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Token no provisto'));
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      rol: decoded.rol
    };
    next();
  } catch (error) {
    next(new HttpError(401, 'Token inválido', error));
  }
};
