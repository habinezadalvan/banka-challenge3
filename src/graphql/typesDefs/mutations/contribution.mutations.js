import { gql } from 'apollo-server-express';

export const contributionMutation = gql`

extend type Mutation{
    addContribution(input: ContributionInput!, file: Upload): Contribution
    approveContribution(id: ID!): Contribution
    updateContribution(id: ID!, input: ContributionUpdateInput, file: Upload): Contribution
}

`;
