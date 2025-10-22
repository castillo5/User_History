import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import ms, { StringValue } from 'ms';
import { env } from '@config/env';
import { User } from '@modules/users/models/User';
import { UserDao } from '@modules/auth/dao/UserDao';
import { RegisterDto } from '@modules/auth/dto/RegisterDto';
import { LoginDto } from '@modules/auth/dto/LoginDto';
import { RefreshDto } from '@modules/auth/dto/RefreshDto';
import { RefreshTokenDao } from '@modules/auth/dao/RefreshTokenDao';
import { HttpError } from '@utils/HttpError';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export class AuthService {
  constructor(
    private readonly userDao = new UserDao(),
    private readonly refreshTokenDao = new RefreshTokenDao()
  ) {}

  async register(payload: RegisterDto): Promise<User> {
    const existing = await this.userDao.findByEmail(payload.email);
    if (existing) {
      throw new HttpError(409, 'Email ya registrado');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    return this.userDao.create({
      nombre: payload.nombre,
      email: payload.email,
      password: hashedPassword,
      rol: payload.rol
    });
  }

  async login(dto: LoginDto): Promise<{ user: User; tokens: TokenPair }> {
    const user = await this.userDao.findByEmail(dto.email);
    if (!user) {
      throw new HttpError(401, 'Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new HttpError(401, 'Credenciales inválidas');
    }

    await this.refreshTokenDao.deleteExpired();
    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  async refresh(dto: RefreshDto): Promise<TokenPair> {
    const hashedToken = this.hashToken(dto.refreshToken);
    const entity = await this.refreshTokenDao.findByHash(hashedToken);
    if (!entity) {
      throw new HttpError(401, 'Refresh token inválido');
    }

    if (entity.expiresAt.getTime() < Date.now()) {
      await this.refreshTokenDao.deleteById(entity.id);
      throw new HttpError(401, 'Refresh token expirado');
    }

    const user = await this.userDao.findById(entity.userId);
    if (!user) {
      throw new HttpError(404, 'Usuario no encontrado');
    }

    await this.refreshTokenDao.deleteById(entity.id);
    return this.generateTokens(user);
  }

  private async generateTokens(user: User): Promise<TokenPair> {
    const accessTokenPayload = { sub: user.id, email: user.email, rol: user.rol };
    const accessTokenOptions: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES as StringValue };
    const accessToken = jwt.sign(accessTokenPayload, env.JWT_ACCESS_SECRET as Secret, accessTokenOptions);

    const refreshToken = this.generateRefreshToken();
    const refreshExpiresMs = ms(env.JWT_REFRESH_EXPIRES as StringValue);
    if (typeof refreshExpiresMs !== 'number') {
      throw new HttpError(500, 'Configuración de expiración inválida');
    }

    const refreshExpiresAt = new Date(Date.now() + refreshExpiresMs);
    const refreshHash = this.hashToken(refreshToken);

    await this.refreshTokenDao.create({
      userId: user.id,
      tokenHash: refreshHash,
      expiresAt: refreshExpiresAt
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_ACCESS_EXPIRES,
      refreshExpiresIn: env.JWT_REFRESH_EXPIRES
    };
  }

  private generateRefreshToken(): string {
    return randomBytes(48).toString('hex');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
