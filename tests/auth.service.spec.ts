import bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { AuthService } from '@modules/auth/services/AuthService';
import { HttpError } from '@utils/HttpError';
import { RegisterDto } from '@modules/auth/dto/RegisterDto';
import { LoginDto } from '@modules/auth/dto/LoginDto';
import { RefreshDto } from '@modules/auth/dto/RefreshDto';
import { User } from '@modules/users/models/User';

const buildUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-id',
  nombre: 'Test',
  email: 'test@sportsline.com',
  password: bcrypt.hashSync('Password123', 10),
  rol: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
}) as User;

describe('AuthService', () => {
  const userDao = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn()
  };
  const refreshTokenDao = {
    create: jest.fn(),
    deleteExpired: jest.fn(),
    findByHash: jest.fn(),
    deleteById: jest.fn()
  };

  const service = new AuthService(userDao as any, refreshTokenDao as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user hashing the password', async () => {
    const dto: RegisterDto = { nombre: 'Ana', email: 'ana@sportsline.com', password: 'Password123', rol: 'admin' };
    const createdUser = buildUser({ email: dto.email });

    userDao.findByEmail.mockResolvedValue(null);
    userDao.create.mockResolvedValue(createdUser);

    const user = await service.register(dto);

    expect(userDao.create).toHaveBeenCalledWith(expect.objectContaining({ email: dto.email }));
    const callArgs = userDao.create.mock.calls[0][0];
    expect(callArgs.password).not.toBe(dto.password);
    expect(await bcrypt.compare(dto.password, callArgs.password)).toBe(true);
    expect(user).toEqual(createdUser);
  });

  it('throws when registering with duplicated email', async () => {
    const dto: RegisterDto = { nombre: 'Ana', email: 'ana@sportsline.com', password: 'Password123', rol: 'admin' };
    userDao.findByEmail.mockResolvedValue(buildUser({ email: dto.email }));

    await expect(service.register(dto)).rejects.toThrow(HttpError);
  });

  it('logs in and returns tokens', async () => {
    const dto: LoginDto = { email: 'test@sportsline.com', password: 'Password123' };
    const userEntity = buildUser();

    userDao.findByEmail.mockResolvedValue(userEntity);

    const response = await service.login(dto);

    expect(refreshTokenDao.deleteExpired).toHaveBeenCalled();
    expect(response.tokens.accessToken).toBeDefined();
    expect(response.tokens.refreshToken).toHaveLength(96);
  });

  it('refreshes a valid token', async () => {
    const refreshToken = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234';
    const dto: RefreshDto = { refreshToken };
    const hashed = createHash('sha256').update(refreshToken).digest('hex');
    const userEntity = buildUser();

    refreshTokenDao.findByHash.mockImplementation(async (tokenHash: string) => {
      if (tokenHash !== hashed) {
        return null;
      }
      return {
        id: 'refresh-id',
        userId: userEntity.id,
        tokenHash: hashed,
        expiresAt: new Date(Date.now() + 1000 * 60)
      };
    });
    userDao.findById.mockResolvedValue(userEntity);

    const result = await service.refresh(dto);

    expect(result.accessToken).toBeDefined();
    expect(refreshTokenDao.deleteById).toHaveBeenCalled();
    expect(refreshTokenDao.create).toHaveBeenCalled();
  });
});
