import { gql } from 'apollo-server-express';

export const reportTypes = gql`
    enum ReportOptions {
        meeting
        financial
        laon
    }
    type Report {
        id: ID
        title: String
        type: ReportOptions
        context: String
    }
`;
