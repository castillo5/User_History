import { UserRole } from '@modules/users/models/User';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      rol: UserRole;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
