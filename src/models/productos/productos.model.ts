import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface ProductoAttributes {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductoCreationAttributes = Optional<ProductoAttributes, 'id'>;

export class Producto extends Model<ProductoAttributes, ProductoCreationAttributes> {}

export const initProductoModel = (sequelize: Sequelize) => {
  if (sequelize.models.Producto) {
    return sequelize.models.Producto as typeof Producto;
  }

  Producto.init(
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
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
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
