import { gql } from 'apollo-server-express';

export const loanMutations = gql`
    extend type Mutation{
        addLoan(input: LoanInput):Loan
        changeRatings(input: RatingsInput!): String
        modifyLoan(id: ID!, input: ModifyLoanInput): Loan
        updateLoan(input: UpdateLoanInput!): Loan
        payLoan(id: ID!, input: payLoanInput!, file: Upload): Loan
        deleteLoan(id: ID!): Boolean
    }

`;
