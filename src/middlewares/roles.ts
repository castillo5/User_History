import { Request, Response, NextFunction } from 'express';
import { HttpError } from '@utils/HttpError';
import { UserRole } from '@modules/users/models/User';

export const authorize = (roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new HttpError(401, 'Usuario no autenticado'));
    }

    if (!roles.includes(req.user.rol)) {
      return next(new HttpError(403, 'Permisos insuficientes'));
    }

    next();
  };
};
