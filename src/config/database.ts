import { Sequelize } from 'sequelize';
import { env, isTest } from './env';

const logging = env.NODE_ENV === 'development' ? console.log : false;

export const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'postgres',
  logging,
  pool: {
    max: isTest ? 1 : 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    if (env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: env.NODE_ENV === 'development' });
    }
    console.log('Database connection established');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
