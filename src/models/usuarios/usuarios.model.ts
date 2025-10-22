import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type UsuarioRol = 'admin' | 'sales';

export interface UsuarioAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UsuarioRol;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UsuarioCreationAttributes = Optional<UsuarioAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'>;

export class Usuario
  extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: UsuarioRol;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
}

export const initUsuarioModel = (sequelize: Sequelize) => {
  if (sequelize.models.Usuario) {
    return sequelize.models.Usuario as typeof Usuario;
  }

  Usuario.init(
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'sales'),
        allowNull: false,
        defaultValue: 'sales',
      },
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
