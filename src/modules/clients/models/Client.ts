import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@config/database';

export interface ClientAttributes {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClientCreationAttributes = Optional<ClientAttributes, 'id' | 'direccion'>;

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: string;
  public nombre!: string;
  public email!: string;
  public telefono!: string;
  public direccion!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(150),
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
    telefono: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'clients'
  }
);
