import { gql } from 'apollo-server-express';


export const roleTypes = gql`
    type Role {
        id: ID!
        name: String!
        description: String!
    }
`;
