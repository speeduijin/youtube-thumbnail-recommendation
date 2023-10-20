import passport from 'passport';
import { FieldPacket } from 'mysql2/promise';
import promisePool from '../db';
import local from './localStrategy';
import User from '../../types/user';

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [rows]: [User[], FieldPacket[]] = await promisePool.execute(
        'SELECT * FROM users WHERE id = ?;',
        [id],
      );
      const user = rows[0];

      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  local();
};
