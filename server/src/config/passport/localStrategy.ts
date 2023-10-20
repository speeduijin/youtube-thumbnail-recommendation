import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { FieldPacket } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import promisePool from '../db';
import { isInvalidEmail, isInvalidPassword } from '../../utils/validation';
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
          if (isInvalidEmail(email))
            return done(null, false, { message: 'invalidEmail' });

          if (isInvalidPassword(password))
            return done(null, false, { message: 'invalidPassword' });

          const [rows]: [User[], FieldPacket[]] = await promisePool.execute(
            'SELECT * FROM users WHERE email = ? Limit 1;',
            [email],
          );
          const exUser = rows[0];

          if (exUser) {
            const isCorrectPassword = await bcrypt.compare(
              password,
              exUser.password,
            );

            if (isCorrectPassword) return done(null, exUser);

            return done(null, false, { message: 'incorrectPassword' });
          }

          return done(null, false, { message: 'noUser' });
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
};
