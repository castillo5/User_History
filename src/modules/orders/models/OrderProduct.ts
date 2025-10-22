import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@config/database';

export interface OrderProductAttributes {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtSale: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderProductCreationAttributes = Optional<OrderProductAttributes, 'id'>;

export class OrderProduct
  extends Model<OrderProductAttributes, OrderProductCreationAttributes>
  implements OrderProductAttributes
{
  public id!: string;
  public orderId!: string;
  public productId!: string;
  public quantity!: number;
  public priceAtSale!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderProduct.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    priceAtSale: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  },
  {
    sequelize,
    tableName: 'order_products'
  }
);
