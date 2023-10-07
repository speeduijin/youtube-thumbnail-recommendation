import { RequestHandler, ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import logger from './config/logger';

export const notFoundHandler: RequestHandler = (req, res, next) => {
  const error = createHttpError(
    404,
    `The requested URL '${req.method} ${req.url}' was not found on this server.`,
  );
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err.message);

  const { message } = err;
  const error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.json({ message, status: error.status, stack: error.stack });
};
