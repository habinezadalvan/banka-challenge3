import {
  format, transports, createLogger, add, addColors,
} from 'winston';

const myCustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
  },
};

export const logger = () => {
  addColors(myCustomLevels.colors);
  createLogger({
    levels: myCustomLevels.levels,
    format: format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/combined.log' }),
    ],
    exceptionHandlers: [
      new transports.File({ filename: 'logs/exceptions.log' }),
    ],
  });
  if (process.env.NODE_ENV !== 'production') {
    add(new transports.Console({
      format: format.combine(
        format.colorize(),
        format.json(),
      ),
    }));
  }
};
