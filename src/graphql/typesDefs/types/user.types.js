import { gql } from 'apollo-server-express';

export const userTypes = gql`
    type User {
        id: ID
        firstName: String!
        lastName: String!
        userName: String!
        email: String!
        avatar: String
        role: Role
        position: Position
        positionStatus: String
        savings: Saving
        accountStatus: String
        constributions: [Contribution]
        reports: [Report]
        votes: [Vote]
        votingEvents: [VotingEvent]
        events: [Event]
        token: String
        createdAt: String
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
    input UpdateUserInput {
        firstName: String
        lastName: String
        userName: String
        email: String
        avatar: String
        roleId: Int
        phoneNo: String
        verified: Boolean
        positionId: Int
        positionStatus: String
        savingsId: Int
        accountStatus: String
    }

    input ResetPassword {
        oldPassword: String!
        newPassword: String!
        comparePassword: String!
    }
`;
