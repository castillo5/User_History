import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Usuario, UsuarioAttributes } from '../models/usuarios/usuarios.model';
import { RefreshToken } from '../models/tokens/refresh-token.model';

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
  accessToken: string;
  refreshToken: string;
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

    await this.revokeUserTokens(user.id);

    const { accessToken, refreshToken } = await this.issueTokens(user);

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
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

    await this.revokeUserTokens(user.id);

    const { accessToken, refreshToken } = await this.issueTokens(user);

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    if (!refreshToken) {
      throw new AuthError('Refresh token requerido.', 400);
    }

    const hashed = hashToken(refreshToken);
    const tokenRecord = await RefreshToken.findOne({ where: { token: hashed } });

    if (!tokenRecord) {
      throw new AuthError('Refresh token inválido.', 401);
    }

    if (tokenRecord.revokedAt) {
      throw new AuthError('Refresh token revocado.', 401);
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      throw new AuthError('Refresh token expirado.', 401);
    }

    const user = await Usuario.findByPk(tokenRecord.userId);
    if (!user) {
      throw new AuthError('Usuario no encontrado para refresh token.', 404);
    }

    await tokenRecord.update({ revokedAt: new Date() });

    const { accessToken, refreshToken: newRefreshToken } = await this.issueTokens(user);

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  private async issueTokens(user: Usuario) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(user: Usuario) {
    const secret = getJwtSecret();
    const expiresInConfig = process.env.JWT_EXPIRES_IN ?? '1h';
    const expiresInSeconds = parseDurationToSeconds(expiresInConfig);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const options: SignOptions = {
      expiresIn: expiresInSeconds,
    };

    return jwt.sign(payload, secret, options);
  }

  private async generateRefreshToken(user: Usuario) {
    const rawToken = crypto.randomBytes(64).toString('hex');
    const hashedToken = hashToken(rawToken);
    const ttlInput = process.env.REFRESH_TOKEN_TTL ?? '7d';
    const ttlMs = parseDurationToSeconds(ttlInput) * 1000;

    if (!ttlMs || Number.isNaN(ttlMs)) {
      throw new AuthError('Valor inválido para REFRESH_TOKEN_TTL.', 500);
    }

    const expiresAt = new Date(Date.now() + ttlMs);

    await RefreshToken.create({
      token: hashedToken,
      userId: user.id,
      expiresAt,
    });

    return rawToken;
  }

  private async revokeUserTokens(userId: number) {
    await RefreshToken.update(
      { revokedAt: new Date() },
      {
        where: {
          userId,
          revokedAt: null,
        },
      }
    );
  }
}

export const hashPassword = (plainPassword: string) => bcrypt.hash(plainPassword, SALT_ROUNDS);

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

const DURATION_REGEX = /^\s*(\d+)\s*(s|m|h|d|w)\s*$/i;
const UNIT_TO_SECONDS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
  w: 60 * 60 * 24 * 7,
};

const parseDurationToSeconds = (value: string): number => {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new AuthError('La duración configurada no puede ser vacía.', 500);
  }

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  const match = trimmed.match(DURATION_REGEX);

  if (!match) {
    throw new AuthError('Formato de duración inválido. Usa valores como 3600, 15m, 1h o 7d.', 500);
  }

  const amount = Number(match[1]);
  const unitKey = match[2].toLowerCase();
  const multiplier = UNIT_TO_SECONDS[unitKey];

  if (!multiplier) {
    throw new AuthError('Unidad de tiempo no soportada en la duración configurada.', 500);
  }

  return amount * multiplier;
};
