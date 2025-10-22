import { Client } from '@modules/clients/models/Client';
import { Order } from '@modules/orders/models/Order';
import { OrderProduct } from '@modules/orders/models/OrderProduct';
import { Product } from '@modules/products/models/Product';
import { RefreshToken } from '@modules/auth/models/RefreshToken';
import { User } from '@modules/users/models/User';

let associationsConfigured = false;

export const setupModelAssociations = (): void => {
  if (associationsConfigured) {
    return;
  }

  User.hasMany(Order, { foreignKey: 'usuarioId', as: 'orders' });
  Order.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

  Client.hasMany(Order, { foreignKey: 'clienteId', as: 'orders' });
  Order.belongsTo(Client, { foreignKey: 'clienteId', as: 'cliente' });

  Order.belongsToMany(Product, {
    through: OrderProduct,
    foreignKey: 'orderId',
    otherKey: 'productId',
    as: 'products'
  });

  Product.belongsToMany(Order, {
    through: OrderProduct,
    foreignKey: 'productId',
    otherKey: 'orderId',
    as: 'orders'
  });

  Order.hasMany(OrderProduct, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
  OrderProduct.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  Product.hasMany(OrderProduct, { foreignKey: 'productId', as: 'orderItems' });
  OrderProduct.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens', onDelete: 'CASCADE' });
  RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  associationsConfigured = true;
};
