import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { FieldPacket } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { isValidEmail, isValidPassword } from '../../utils/validation';
import promisePool from '../db';
import logger from '../logger';
import User from '../../types/user';

export default () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          if (!isValidEmail(email))
            return done(null, false, { message: 'invalidEmail' });

          if (!isValidPassword(password))
            return done(null, false, { message: 'invalidPassword' });

          const [rows]: [User[], FieldPacket[]] = await promisePool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email],
          );

          const exUser = rows[0];

          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);

            if (result) return done(null, exUser);

            return done(null, false, { message: 'incorrectPassword' });
          }

          return done(null, false, { message: 'noUser' });
        } catch (error) {
          logger.error(error);
          return done(error);
        }
      },
    ),
  );
};
