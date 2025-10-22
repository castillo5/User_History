import { User, UserCreationAttributes } from '@modules/users/models/User';

export class UserDao {
  async create(data: UserCreationAttributes): Promise<User> {
    return User.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }
}
