import { createPool } from 'mysql2';
import configObj from './config';

const { db } = configObj;
const env = (process.env.NODE_ENV as 'production' | 'test') || 'development';
const config = db[env];

const pool = createPool(config);
const promisePool = pool.promise();

export { pool, promisePool };
