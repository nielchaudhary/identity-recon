import express from 'express';
const app = express();
import 'reflect-metadata';
import { Logger } from './utils/logger';
import { dbConnect } from './utils/database';
import { identifyHandler } from './handlers/identifyHandler';
const logger = new Logger('AppLogger');

app.use(express.json());

app.post('/identify', identifyHandler)
const onServerRunning = async () => {
  await dbConnect();
  logger.info('Server Running on Port 3000');
};


app.listen(3000, onServerRunning);