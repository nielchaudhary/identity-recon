import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { Logger } from '../utils/logger';

dotenv.config();

const logger = new Logger('DBLogger');


export const dbConnect = async () => {
  const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    database : 'contacts',
    password: process.env.DB_PASSWORD, 
    connectionLimit: 10,
  });

  try {
    const [rows] = await pool.query("SELECT * FROM Identity");
    logger.info(`Connected to database.`);
  } catch (err) {
    logger.error('Error connecting to database:', err as Error);
  }
};