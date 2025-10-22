import crypto from 'crypto';
import sequelize from '../config/database';
import { initModels, Producto, Usuario } from '../models';

const hash = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

const seed = async () => {
  try {
    console.log('🔄 Iniciando siembra de datos...');
    await sequelize.authenticate();
    initModels(sequelize);

    await sequelize.sync({ force: true });
    console.log('🧹 Tablas sincronizadas.');

    const adminUser = await Usuario.create({
      name: 'Administrador',
      email: 'admin@sportsline.com',
      password: hash('Admin123!'),
      role: 'admin',
    });
    console.log(`👤 Usuario administrador creado: ${adminUser.email}`);

    await Producto.bulkCreate([
      {
        name: 'Camiseta deportiva',
        code: 'SKU-TSHIRT-001',
        price: 59.99,
        stock: 25,
        description: 'Camiseta transpirable para entrenamiento.',
      },
      {
        name: 'Balón de fútbol profesional',
        code: 'SKU-BALL-002',
        price: 89.5,
        stock: 18,
        description: 'Balón oficial con certificación FIFA Quality Pro.',
      },
      {
        name: 'Guantes de portero',
        code: 'SKU-GLOVES-003',
        price: 45.0,
        stock: 12,
        description: 'Guantes con agarre reforzado para climas húmedos.',
      },
    ]);
    console.log('📦 Productos de ejemplo insertados.');

    console.log('✅ Siembra completada.');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la siembra de datos:', error);
    await sequelize.close();
    process.exit(1);
  }
};

void seed();
