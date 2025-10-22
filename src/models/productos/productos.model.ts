import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface ProductoAttributes {
  id: number;
  name: string;
  code: string;
  price: number;
  stock: number;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductoCreationAttributes = Optional<
  ProductoAttributes,
  'id' | 'description' | 'createdAt' | 'updatedAt'
>;

export class Producto
  extends Model<ProductoAttributes, ProductoCreationAttributes>
  implements ProductoAttributes
{
  declare id: number;
  declare name: string;
  declare code: string;
  declare price: number;
  declare stock: number;
  declare description: string | null;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
}

export const initProductoModel = (sequelize: Sequelize) => {
  if (sequelize.models.Producto) {
    return sequelize.models.Producto as typeof Producto;
  }

  Producto.init(
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
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Producto',
      tableName: 'productos',
      timestamps: true,
      underscored: true,
    }
  );

  return Producto;
};
