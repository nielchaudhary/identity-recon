import express from 'express';
const app = express();

import { Logger } from './utils/logger';
import { dbConnect } from './utils/database';
const logger = new Logger('AppLogger');

const onServerRunning = async () => {
  await dbConnect();
  logger.info('Server Running on Port 3000');
};


app.listen(3000, onServerRunning);