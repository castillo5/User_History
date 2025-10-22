import bcrypt from 'bcryptjs';
import { connectDatabase, sequelize } from '@config/database';
import { env } from '@config/env';
import { setupModelAssociations } from '@modules/setupModels';
import { User } from '@modules/users/models/User';
import { Product } from '@modules/products/models/Product';

const seed = async (): Promise<void> => {
  try {
    setupModelAssociations();
    await connectDatabase();

    await sequelize.sync({ force: true });

    const adminPassword = await bcrypt.hash('Admin1234!', 10);

    await User.create({
      nombre: 'Administrador SportsLine',
      email: 'admin@sportsline.com',
      password: adminPassword,
      rol: 'admin'
    });

    await Product.bulkCreate([
      {
        nombre: 'Balón de fútbol Pro',
        codigo: 'BAL-001',
        precio: 59.99,
        categoria: 'Fútbol',
        stock: 50
      },
      {
        nombre: 'Raqueta de tenis Elite',
        codigo: 'RAQ-101',
        precio: 199.5,
        categoria: 'Tenis',
        stock: 20
      },
      {
        nombre: 'Zapatillas Trail Runner',
        codigo: 'ZAP-501',
        precio: 129.99,
        categoria: 'Running',
        stock: 35
      }
    ]);

    console.log('Seed completado');
  } catch (error) {
    console.error('Error durante el seed', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

seed();
