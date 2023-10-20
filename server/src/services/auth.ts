import { FieldPacket } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import promisePool from '../config/db';
import { isInvalidEmail, isInvalidPassword } from '../utils/validation';
import User from '../types/user';

const join = async (reqEmail: string, reqPassword: string) => {
  if (isInvalidEmail(reqEmail)) return 'invalidEmail';

  if (isInvalidPassword(reqPassword)) return 'invalidPassword';

  const [rows]: [User[], FieldPacket[]] = await promisePool.execute(
    'SELECT * FROM users WHERE email = ? LIMIT 1;',
    [reqEmail],
  );
  const exUser = rows[0];

  if (exUser) return 'exUser';

  const hashPassword = await bcrypt.hash(reqPassword, 12);

  await promisePool.execute(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [reqEmail, hashPassword],
  );

  return 'successJoin';
};

export default join;
