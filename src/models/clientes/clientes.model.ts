import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface ClienteAttributes {
  id: number;
  name: string;
  phone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClienteCreationAttributes = Optional<ClienteAttributes, 'id'>;

export class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes> {}

export const initClienteModel = (sequelize: Sequelize) => {
  if (sequelize.models.Cliente) {
    return sequelize.models.Cliente as typeof Cliente;
  }

  Cliente.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
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
