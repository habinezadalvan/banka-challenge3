import { gql } from 'apollo-server-express';


export const userQueries = gql`
    type Query {
        users(createdAt: String): [User]
        getUser(id: ID!): User
        me: User
    }
`;
