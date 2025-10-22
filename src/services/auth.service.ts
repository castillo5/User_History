import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { Usuario, UsuarioAttributes } from '../models/usuarios/usuarios.model';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<UsuarioAttributes, 'password'>;
  token: string;
}

export class AuthError extends Error {
  constructor(message: string, public statusCode = 400) {
    super(message);
    this.name = 'AuthError';
  }
}

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? '10');

const getJwtSecret = (): Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AuthError('JWT_SECRET no está configurado en las variables de entorno.', 500);
  }

  return secret;
};

const sanitizeUser = (user: Usuario): Omit<UsuarioAttributes, 'password'> => {
  const { password, ...rest } = user.get({ plain: true }) as UsuarioAttributes;
  return rest;
};

export class AuthService {
  async register({ name, email, password, role }: RegisterDto): Promise<AuthResult> {
    if (!name || !email || !password) {
      throw new AuthError('Nombre, email y contraseña son obligatorios.');
    }

    const existing = await Usuario.findOne({ where: { email } });
    if (existing) {
      throw new AuthError('El correo ya está registrado.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await Usuario.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
    });

    const token = this.generateToken(user);

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  async login({ email, password }: LoginDto): Promise<AuthResult> {
    if (!email || !password) {
      throw new AuthError('Email y contraseña son obligatorios.');
    }

    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      throw new AuthError('Credenciales inválidas.', 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new AuthError('Credenciales inválidas.', 401);
    }

    const token = this.generateToken(user);

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  private generateToken(user: Usuario) {
    const secret = getJwtSecret();
    const expiresInConfig = process.env.JWT_EXPIRES_IN ?? '1h';

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const options: SignOptions = {};

    if (expiresInConfig) {
      options.expiresIn = /^\d+$/.test(expiresInConfig)
        ? Number(expiresInConfig)
        : (expiresInConfig as StringValue);
    }

    return jwt.sign(payload, secret, options);
  }
}

export const hashPassword = (plainPassword: string) => bcrypt.hash(plainPassword, SALT_ROUNDS);
