import { gql } from 'apollo-server-express';

export const userType = gql`
    type User {
        id: ID
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        password: String!
        bio: String
        avatar: String
    }
`;
