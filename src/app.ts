import express from 'express';
const app = express();

import { Logger, globalLogger } from './utils/logger';
const logger = new Logger('rootAppLogger');

const onServerRunning = () => {
  logger.info('Server Running on Port 3000');
};


app.listen(3000, onServerRunning);