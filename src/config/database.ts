import { Options, Sequelize } from 'sequelize';
import 'dotenv/config';

const connectionUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
const enableSSL = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';

const baseOptions: Options = {
  dialect: 'postgres',
  logging: false,
};

if (enableSSL) {
  baseOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = connectionUrl
  ? new Sequelize(connectionUrl, baseOptions)
  : new Sequelize(
      process.env.DB_NAME ?? '',
      process.env.DB_USER ?? '',
      process.env.DB_PASSWORD ?? '',
      {
        ...baseOptions,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? '5432'),
      }
    );

export default sequelize;
