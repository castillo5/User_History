import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ProductoAttributes {
  // TODO: Definir atributos como nombre, precio, stock, etc.
}

export class Producto extends Model<ProductoAttributes> {}

export const initProductoModel = (sequelize: Sequelize) => {
  Producto.init(
    {
      // Ejemplo de columna pendiente:
      // nombre: { type: DataTypes.STRING, allowNull: false },
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
