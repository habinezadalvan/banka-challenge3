import { gql } from 'apollo-server-express';

export const loanQueris = gql`
    extend type Query{
        fetchLoan(id: ID!): Loan
        fetchAllLoans(createdAt: String): [Loan]
    }
`;
