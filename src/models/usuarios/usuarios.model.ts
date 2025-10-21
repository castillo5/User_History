import { DataTypes, Model, Sequelize } from 'sequelize';

export interface UsuarioAttributes {
  // TODO: Definir campos como username, passwordHash, roles, etc.
}

export class Usuario extends Model<UsuarioAttributes> {}

export const initUsuarioModel = (sequelize: Sequelize) => {
  Usuario.init(
    {
      // Ejemplo de columna a completar:
      // username: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      timestamps: true,
      underscored: true,
    }
  );

  return Usuario;
};
