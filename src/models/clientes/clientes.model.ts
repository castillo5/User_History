import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ClienteAttributes {
  // TODO: Definir la estructura final del cliente (ej. nombre, email, etc.).
}

export class Cliente extends Model<ClienteAttributes> {}

export const initClienteModel = (sequelize: Sequelize) => {
  Cliente.init(
    {
      // Ejemplo de columna a completar más adelante:
      // nombre: { type: DataTypes.STRING, allowNull: false },
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
