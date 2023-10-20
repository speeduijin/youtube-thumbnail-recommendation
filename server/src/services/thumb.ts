import { FieldPacket } from 'mysql2/promise';
import promisePool from '../config/db';
import Thumb from '../types/thumb';

const random = async () => {
  const query = `SELECT id, video_id FROM thumbnails ORDER BY RAND() LIMIT 16`;

  const [rows]: [Thumb[], FieldPacket[]] = await promisePool.execute(query);

  return rows;
};

export default random;
