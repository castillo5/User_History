import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@config/database';

export type UserRole = 'admin' | 'vendedor';

export interface UserAttributes {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public rol!: UserRole;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM('admin', 'vendedor'),
      allowNull: false,
      defaultValue: 'vendedor'
    }
  },
  {
    sequelize,
    tableName: 'users'
  }
);
