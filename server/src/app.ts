import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';

import authRouter from './routes/auth';
import { notFoundHandler, errorHandler } from './utils/errorHandler';
import passportConfig from './config/passport';
import logger from './config/logger';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

passportConfig();

if (isProduction) {
  app.enable('trust proxy');
  app.use(
    helmet({
      // contentSecurityPolicy: false,
      // crossOriginResourcePolicy: false,
    }),
  );
}

app.use(
  morgan(isProduction ? 'combined' : 'dev', {
    stream: {
      write: (message) => {
        logger.info(message);
      },
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIE_SECRET!,
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
      httpOnly: true,
      secure: isProduction,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
