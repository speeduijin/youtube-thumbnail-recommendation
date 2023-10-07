import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import stripAnsi from 'strip-ansi';
import path from 'path';

const {
  combine,
  printf,
  label: labelFormat,
  timestamp: timestampFormat,
  colorize,
  simple,
} = format;

const logDir = path.join(process.cwd(), '/logs');

const fileFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} [${label}] ${level}: ${stripAnsi(message)}`,
);

const loggerFormat = combine(
  labelFormat({ label: 'express-boilerplate' }),
  timestampFormat({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  fileFormat,
);

const commonTransportOptions = {
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
};

const errorTransport = new DailyRotateFile({
  level: 'error',
  filename: `%DATE%-error.log`,
  dirname: `${logDir}/error`,
  ...commonTransportOptions,
});

const infoTransport = new DailyRotateFile({
  level: 'info',
  filename: `%DATE%.log`,
  dirname: logDir,
  ...commonTransportOptions,
});

const logger = createLogger({
  format: loggerFormat,
  transports: [errorTransport, infoTransport],
});

if (process.env.NODE_ENV !== 'production')
  logger.add(new transports.Console({ format: combine(colorize(), simple()) }));

export default logger;
