import { createPool } from 'mysql2/promise';
import configObj from './config';

const env = (process.env.NODE_ENV as 'production' | 'test') || 'development';
const config = configObj[env];

const promisePool = createPool(config);

export default promisePool;
