import { gql } from 'apollo-server-express';

export const contributionMutation = gql`

extend type Mutation{
    addContribution(input: ContributionInput!, file: Upload): Contribution
}

`;
