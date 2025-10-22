import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@config/database';

export interface ProductAttributes {
  id: string;
  nombre: string;
  codigo: string;
  precio: number;
  categoria: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductCreationAttributes = Optional<ProductAttributes, 'id'>;

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public nombre!: string;
  public codigo!: string;
  public precio!: number;
  public categoria!: string;
  public stock!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
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
    codigo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    categoria: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  },
  {
    sequelize,
    tableName: 'products'
  }
);
