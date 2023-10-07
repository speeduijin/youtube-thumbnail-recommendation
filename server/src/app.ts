import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';

import { notFoundHandler, errorHandler } from './middlewares';
import logger from './config/logger';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

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
app.use(express.urlencoded({ extended: true })); // extended - 객체로 변환
app.use(cookieParser());
app.use(compression());
app.use(
  session({
    secret: process.env.COOKIE_SECRET!, // !: Non-Null
    resave: false,
    saveUninitialized: false,
    proxy: isProduction, // true - nginx, apache...
    cookie: {
      httpOnly: true,
      secure: isProduction, // true - https
    },
  }),
);

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
