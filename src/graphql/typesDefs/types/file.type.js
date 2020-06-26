import { gql } from 'apollo-server-express';

export const fileType = gql`
    type File {
        id: ID
        file: String
        createdAt: String
    }
`;
