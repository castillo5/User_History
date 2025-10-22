import { Sequelize } from 'sequelize';

import { Cliente, initClienteModel } from './clientes/clientes.model';
import { Producto, initProductoModel } from './productos/productos.model';
import { Usuario, initUsuarioModel } from './usuarios/usuarios.model';
import { RefreshToken, initRefreshTokenModel } from './tokens/refresh-token.model';

export const initModels = (sequelize: Sequelize) => {
  initClienteModel(sequelize);
  initProductoModel(sequelize);
  const userModel = initUsuarioModel(sequelize);
  const refreshTokenModel = initRefreshTokenModel(sequelize);

  userModel.hasMany(refreshTokenModel, {
    as: 'refreshTokens',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });

  refreshTokenModel.belongsTo(userModel, {
    as: 'user',
    foreignKey: 'userId',
  });
};

export { Cliente, Producto, Usuario, RefreshToken };
