import { gql } from 'apollo-server-express';

export const userType = gql`
    type User {
        id: ID
        firstName: String!
        lastName: String!
        userName: String!
        email: String!
        password: String!
        avatar: String
        roleId: Int!
        positionId: Int!
        positionStatus: String
        savingsId: Int
        accountStatus: String
        token: String
    }
    input LoginInput {
        email: String!
        password: String!
    }
    type Token {
        token: String
    }
    input AddUserInput {
        firstName: String!
        lastName: String!
        userName: String!
        email: String!
        password: String!
        avatar: String
        roleId: Int!
        phoneNo: String
    }
`;
