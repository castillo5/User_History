import { Op } from 'sequelize';
import { RefreshToken, RefreshTokenCreationAttributes } from '@modules/auth/models/RefreshToken';

export class RefreshTokenDao {
  async create(data: RefreshTokenCreationAttributes): Promise<RefreshToken> {
    return RefreshToken.create(data);
  }

  async deleteByUserId(userId: string): Promise<number> {
    return RefreshToken.destroy({ where: { userId } });
  }

  async deleteExpired(now: Date = new Date()): Promise<number> {
    return RefreshToken.destroy({ where: { expiresAt: { [Op.lt]: now } } });
  }

  async findByHash(tokenHash: string): Promise<RefreshToken | null> {
    return RefreshToken.findOne({ where: { tokenHash } });
  }

  async deleteById(id: string): Promise<number> {
    return RefreshToken.destroy({ where: { id } });
  }
}
