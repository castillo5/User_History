import { Sequelize } from 'sequelize';
import 'dotenv/config';

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_SSL,
} = process.env;

const missing = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'].filter((key) => !(process.env[key] && process.env[key]?.length));
if (missing.length) {
  throw new Error(`Variables de entorno faltantes para la base de datos: ${missing.join(', ')}`);
}

const useSSL = DB_SSL === 'true' || DB_SSL === '1';

const sequelize = new Sequelize(DB_NAME as string, DB_USER as string, DB_PASSWORD as string, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'postgres',
  logging: false,
  dialectOptions: useSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : undefined,
});

export default sequelize;
