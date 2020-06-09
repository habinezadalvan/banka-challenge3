import { gql } from 'apollo-server-express';

export const contributionQueries = gql`
    extend type Query{
        getContribution(id: ID!): Contribution
        contributions(createdAt: String): [Contribution]
    }
`;
