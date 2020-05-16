import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import winston from 'winston';
import { typeDefs } from './graphql/typesDefs';
import { resolvers } from './graphql/resolvers';
import { logger } from './logging/config';
import { verifyDatabaseConnection } from './sequelize/config/verifydb';
import 'dotenv/config';

logger();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    token: req.headers.authorization,
  }),
});

const app = express();
app.use(cors());

server.applyMiddleware({ app }, '/graphql');
const port = process.env.PORT || 5050;

verifyDatabaseConnection();
app.listen(port, () => winston.info(`server is running on port ${port}`));
