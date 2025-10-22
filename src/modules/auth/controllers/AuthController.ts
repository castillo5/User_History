import { Request, Response } from 'express';
import { AuthService } from '@modules/auth/services/AuthService';
import { RegisterDto } from '@modules/auth/dto/RegisterDto';
import { LoginDto } from '@modules/auth/dto/LoginDto';
import { RefreshDto } from '@modules/auth/dto/RefreshDto';
import { User } from '@modules/users/models/User';
import { UserAttributes } from '@modules/users/models/User';

const sanitizeUser = (user: User) => {
  const plain = user.get({ plain: true }) as UserAttributes;
  const { password, ...rest } = plain;
  return rest;
};

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as RegisterDto;
    const user = await this.authService.register(dto);
    res.status(201).json({ user: sanitizeUser(user) });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as LoginDto;
    const { user, tokens } = await this.authService.login(dto);
    res.status(200).json({
      user: sanitizeUser(user),
      tokens
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as RefreshDto;
    const tokens = await this.authService.refresh(dto);
    res.status(200).json({ tokens });
  };

  me = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ user: req.user });
  };
}
