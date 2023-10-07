import 'dotenv/config';
import app from './app';
import { pool } from './config/db';
import logger from './config/logger';
import configObj from './config/config';

const { port } = configObj;

const handleDBConnecting = (err: NodeJS.ErrnoException | null) => {
  if (err) {
    logger.error('❌ DB Error', err);
  } else {
    logger.info('✅ Connected to DB');
  }
};

const handleListening = () =>
  logger.info(`✅ Server listening on port ${port}`);

pool.getConnection(handleDBConnecting);

app.listen(port, handleListening);
