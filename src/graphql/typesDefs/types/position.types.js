import { gql } from 'apollo-server-express';

export const positionTypes = gql`
    type Position {
        id: ID!
        name: String!
        description: String!
    }

`;
