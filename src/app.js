import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import cors from 'cors';
import {typeDefs} from './graphql/types';
import { resolvers } from './graphql/resolvers';


const server = new ApolloServer({typeDefs, resolvers});

const app = express();

app.use(cors())

server.applyMiddleware({app}, '/graphql')
const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`server is running on port ${port}`))

