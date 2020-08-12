const dotenv = require('dotenv');

dotenv.config();

module.exports.development = {
  dialect: 'postgres',
  seederStorage: 'sequelize',
  url: process.env.DATABASE_URL,
  logging: false,
};

module.exports.production = {
  dialect: 'postgres',
  url: process.env.DATABASE_URL,
  logging: false,
};

module.exports.test = {
  dialest: 'postgres',
  seederStorage: 'sequelize',
  url: process.env.TEST_DB_URL,
  logging: false,
};
