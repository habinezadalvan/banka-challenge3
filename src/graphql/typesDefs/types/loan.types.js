import { gql } from 'apollo-server-express';


export const loanTypes = gql`
    type Loan{
        id: ID
        amount: Int
        paymentDeadLine:String
        approved: Boolean
        paid: Boolean
        expectedAmountToBePaid: Int
        user: User
        paidAmount: Int
        interest: Int
        interestRate: Int
        createdAt: String
    }
    input LoanInput{
        amount: Int!
        paymentDeadLine:String!
        motif: String
    }
    input UpdateLoanInput{
        amount: Int
        paymentDeadLine:String
        motif: String
    }
`;
