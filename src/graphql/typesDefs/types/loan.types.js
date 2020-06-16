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
        rejected: Boolean
        closed: Boolean
        paymentOption: String
        bankReceipt: String
    }
    input LoanInput{
        amount: Int!
        paymentDeadLine:String!
        motif: String
    }
    input ModifyLoanInput{
        amount: Int
        paymentDeadLine:String
        motif: String
    }
    input UpdateLoanInput{
        id: ID!, 
        action: String!
    }

    input RatingsInput{
        rate: Int!
        action: String!
    }

    input payLoanInput{
        amount: Int!
        paymentOption: PaymentOptions
    }

`;
