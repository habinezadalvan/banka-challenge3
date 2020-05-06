import { gql } from 'apollo-server-express';

export const userType = gql`
    type User {
        id: ID
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        password: String!
        avatar: String
        roleId: Int!
        positionId: Int!
        userPositionStatusId: Int!
        savingsId: Int
        accountStatus: String
        token: Token
    }
    input LoginInput {
        email: String!
        password: String!
    }
    type Token {
        token: String
    }
`;
