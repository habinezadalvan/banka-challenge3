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
        createdAt: String
    }
    input LoanInput{
        amount: Int!
        paymentDeadLine:String!
    }
`;
