import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import winston from 'winston';
import cookieParser from 'cookie-parser';
import { typeDefs } from './graphql/typesDefs';
import { resolvers } from './graphql/resolvers';
import { logger } from './logging/config';
import { verifyDatabaseConnection } from './sequelize/config/verifydb';
import 'dotenv/config';
import router from './RESTful/routes';

logger();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    token: req.headers.authorization && req.headers.authorization.split(' ')[1],
    res,
  }),
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use('/', router);

server.applyMiddleware({ app }, '/graphql');


verifyDatabaseConnection();
const port = process.env.PORT || 5050;
app.listen(port, () => winston.info(`server is running on port ${port}`));
