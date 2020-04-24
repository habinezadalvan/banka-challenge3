// eslint-disable-next-line import/no-unresolved
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import winston from 'winston';
import { typeDefs } from './graphql/types';
import { resolvers } from './graphql/resolvers';
import { logger } from './logging/config';
import './db/connectDb';

logger();

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
app.use(cors());

server.applyMiddleware({ app }, '/graphql');
const port = process.env.PORT || 5050;

app.listen(port, () => winston.info(`server is running on port ${port}`));
