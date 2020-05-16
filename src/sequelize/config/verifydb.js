import winston from 'winston';
import database from '../models';

export const verifyDatabaseConnection = async () => {
  try {
    await database.sequelize.authenticate();
    await database.sequelize.sync();
    winston.info('Connection has been established successfully.');
  } catch (error) {
    winston.error('Unable to connect to the database:', error);
  }
};
