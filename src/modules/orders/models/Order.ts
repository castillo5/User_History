import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@config/database';

export type OrderStatus = 'pendiente' | 'preparando' | 'entregado';

export interface OrderAttributes {
  id: string;
  clienteId: string;
  usuarioId: string;
  fecha: Date;
  estado: OrderStatus;
  total: number;
  encryptedDetails: string | null;
  encryptionIv: string | null;
  encryptionAuthTag: string | null;
  encryptionKey: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderCreationAttributes = Optional<
  OrderAttributes,
  'id' | 'estado' | 'fecha' | 'total' | 'encryptedDetails' | 'encryptionIv' | 'encryptionAuthTag' | 'encryptionKey'
>;

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public clienteId!: string;
  public usuarioId!: string;
  public fecha!: Date;
  public estado!: OrderStatus;
  public total!: number;
  public encryptedDetails!: string | null;
  public encryptionIv!: string | null;
  public encryptionAuthTag!: string | null;
  public encryptionKey!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    clienteId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'preparando', 'entregado'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    encryptedDetails: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    encryptionIv: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    encryptionAuthTag: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    encryptionKey: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'orders'
  }
);
