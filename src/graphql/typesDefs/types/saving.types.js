import { gql } from 'apollo-server-express';

export const savingTypes = gql`
    type Saving {
        id: ID!
        amount: Int!
    }
`;
