import { gql } from 'apollo-server-express';

export const contributionTypes = gql`
    enum PaymentOptions {
        bank
        mobile
    }
    type Contribution {
        id: ID!
        amount: Int
        approved: Boolean
        year: Int
        month: Int
        paymentOptions: PaymentOptions
        paid: Boolean
        bankReceipt: String
    }
`;
