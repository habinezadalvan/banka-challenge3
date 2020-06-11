import { gql } from 'apollo-server-express';

export const loanMutations = gql`
    extend type Mutation{
        addLoan(input: LoanInput):Loan
        changeInterestRate(rate: Int!): String
    }

`;
