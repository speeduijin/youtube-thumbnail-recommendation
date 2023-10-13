import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import stripAnsi from 'strip-ansi';
import path from 'path';

const {
  colorize,
  combine,
  label: fLabel,
  printf,
  timestamp: fTimestamp,
} = format;

const logPath = path.join(process.cwd(), '/logs');

const fileLogFormat = combine(
  fLabel({ label: 'youtube-thumbnail-recommendation' }),
  fTimestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  printf(
    ({ label, level, message, timestamp }) =>
      `${timestamp} [${label}] ${level}: ${stripAnsi(message)}`,
  ),
);

const fileTransport = (lev: string) =>
  new DailyRotateFile({
    level: lev,
    filename: `%DATE%-${lev}.log`,
    dirname: lev === 'info' ? logPath : `${logPath}/${lev}`,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
  });

const consoleTransport = new transports.Console({
  format: combine(
    colorize(),
    fTimestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    printf(({ level, message, stack, timestamp }) =>
      stack
        ? `${level}: ${message} {${timestamp}}\n${stack}`
        : `${level}: ${message} {${timestamp}}`,
    ),
  ),
});

const logger = createLogger({
  format: fileLogFormat,
  transports: [fileTransport('error'), fileTransport('info')],
});

if (process.env.NODE_ENV !== 'production') logger.add(consoleTransport);

export default logger;
