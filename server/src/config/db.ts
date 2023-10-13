import { createPool } from 'mysql2/promise';
import configObj from './config';
import logger from './logger';

const env = (process.env.NODE_ENV as 'production' | 'test') || 'development';
const config = configObj[env];

const promisePool = createPool(config);

(async () => {
  try {
    const connection = await promisePool.getConnection();
    connection.release();
    logger.info('✅ Connected to DB');
  } catch (error) {
    logger.error('❌ DB Error', error);
  }
})();

export default promisePool;
