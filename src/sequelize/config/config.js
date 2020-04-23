require('dotenv').config();

module.exports = {
  development: {
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DB,
    host: '127.0.0.1',
    port: process.env.PORT_NUMBER,
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
  },
  test: {
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.TEST_DB,
    host: '127.0.0.1',
    port: process.env.PORT_NUMBER,
    dialect: 'postgres',
    operatorsAliases: false,
  },
  production: {
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DB,
    host: '127.0.0.1',
    port: process.env.PORT_NUMBER,
    dialect: 'postgres',
    operatorsAliases: false,
  },
};
