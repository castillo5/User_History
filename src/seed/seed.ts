import sequelize from '../config/database';
import { initModels, Usuario, Cliente, Producto } from '../models';

async function seed() {
  try {
    console.log('🧹 Limpiando base de datos...');
    initModels(sequelize);
    await sequelize.sync({ force: true }); // ⚠️ Esto borra todo y recrea tablas

    console.log('👤 Insertando usuarios...');
    const users = await Usuario.bulkCreate([
      { name: 'Admin', email: 'admin@example.com', password: '123456', role: 'admin' },
      { name: 'Juan Pérez', email: 'juan@example.com', password: '123456', role: 'user' }
    ]);

    console.log('👥 Insertando clientes...');
    const clients = await Cliente.bulkCreate([
      { name: 'Cliente 1', phone: '3001234567', address: 'Calle 123' },
      { name: 'Cliente 2', phone: '3007654321', address: 'Carrera 45' }
    ]);

    console.log('📦 Insertando productos...');
    const products = await Producto.bulkCreate([
      { name: 'Café', price: 5000, stock: 100, category: 'Bebidas' },
      { name: 'Pan', price: 2000, stock: 50, category: 'Comida' },
      { name: 'Té', price: 4500, stock: 75, category: 'Bebidas' }
    ]);

    console.log('✅ Datos insertados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
    process.exit(1);
  }
}

seed();
