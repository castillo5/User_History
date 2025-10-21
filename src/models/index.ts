import { Sequelize } from 'sequelize';

import { Cliente, initClienteModel } from './clientes/clientes.model';
import { Producto, initProductoModel } from './productos/productos.model';
import { Usuario, initUsuarioModel } from './usuarios/usuarios.model';

export const initModels = (sequelize: Sequelize) => {
  initClienteModel(sequelize);
  initProductoModel(sequelize);
  initUsuarioModel(sequelize);
};

export { Cliente, Producto, Usuario };
