import { gql } from 'apollo-server-express';

export const userTypes = gql`
    type User {
        id: ID
        firstName: String
        lastName: String
        userName: String
        email: String
        avatar: String
        userRole: Role
        userPosition: Position
        positionStatus: String
        userSavings: Saving
        accountStatus: String
        userContributions: [Contribution]
        userReports: [Report]
        userVotes: [Vote]
        userVotingEvents: [VotingEvent]
        userEvents: [Event]
        token: LoginResponse
        createdAt: String
    }
    input LoginInput {
        email: String!
        password: String!
    }

    type LoginResponse {
        accessToken: String
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
        roleId: Int
        verified: Boolean
        positionId: Int
        positionStatus: String
        accountStatus: String
    }

    input UpdateUserProfileInput {
        firstName: String
        lastName: String
        userName: String
        email: String
        avatar: String
        phoneNo: String
    }

    input ResetPassword {
        oldPassword: String!
        newPassword: String!
        comparePassword: String!
    }
`;
