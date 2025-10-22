import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface ClienteAttributes {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClienteCreationAttributes = Optional<ClienteAttributes, 'id' | 'address' | 'createdAt' | 'updatedAt'>;

export class Cliente
  extends Model<ClienteAttributes, ClienteCreationAttributes>
  implements ClienteAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare address: string | null;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
}

export const initClienteModel = (sequelize: Sequelize) => {
  if (sequelize.models.Cliente) {
    return sequelize.models.Cliente as typeof Cliente;
  }

  Cliente.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Cliente',
      tableName: 'clientes',
      timestamps: true,
      underscored: true,
    }
  );

  return Cliente;
};
