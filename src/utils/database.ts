import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { Logger } from '../utils/logger';
import { Contact } from '../model/contactModel';

const logger = new Logger('DBLogger')

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 60000
  },
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  port: 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  pool: {
    max: 15,
    min: 5,
    idle: 20000,
    evict: 15000,
    acquire: 30000
  },
  models: [__dirname + '/../contactModel.ts'], 
});

sequelize.addModels([Contact]);


export const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error as Error);
    throw error;
  }
};

export default sequelize;
