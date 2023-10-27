import express, { RequestHandler, ErrorRequestHandler } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import createHttpError from 'http-errors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import path from 'path';

import authRouter from './routes/auth';
import userRouter from './routes/user';
import thumbRouter from './routes/thumb';
import logger from './config/logger';
import promisePool from './config/db';
import passportConfig from './config/passport';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

passportConfig();

promisePool
  .getConnection()
  .then((connection) => {
    connection.release();
    logger.info('✅ Connected to DB');
  })
  .catch((err) => logger.error('❌ DB Error', err));

if (isProduction) {
  app.enable('trust proxy');
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
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

if (isProduction) app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../public')));
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
app.use('/user', userRouter);
app.use('/thumb', thumbRouter);

if (isProduction)
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../client', 'index.html')),
  );

const notFoundHandler: RequestHandler = (req, res, next) => {
  const error = createHttpError(
    404,
    `The requested URL '${req.method} ${req.url}' was not found on this server.`,
  );
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err.message);

  const { message } = err;
  const error = !isProduction ? err : {};
  res.status(err.status || 500);
  res.json({ message, status: error.status, stack: error.stack });
};

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
