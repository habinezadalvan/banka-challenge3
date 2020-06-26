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
        cover: String
    }
    input ReportInput{
        title: String!
        type: ReportOptions!
        content: String!
    }
`;
