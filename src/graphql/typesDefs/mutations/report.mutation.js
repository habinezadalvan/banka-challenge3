import { gql } from 'apollo-server-express';

export const reportMutations = gql`
    extend type Mutation{
        addReport(input: ReportInput, file: Upload): Report
    }

`;
