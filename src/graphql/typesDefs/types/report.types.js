import { gql } from 'apollo-server-express';

export const reportTypes = gql`
    enum ReportOptions {
        meeting
        financial
        laon
        others
    }
    type Report {
        id: ID
        title: String
        type: ReportOptions
        content: String
    }
    input ReportInput{
        title: String!
        type: ReportOptions!
        content: String!
    }
`;
