import { gql } from 'apollo-server-express';

export const voteTypes = gql`
    type Vote {
        id: ID!
        count: Int!
    }
`;
