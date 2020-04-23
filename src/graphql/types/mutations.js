import { gql } from 'apollo-server-express';

export const mutation = gql`
  type Mutation {
    addUser(firstName: String!, lastName: String!, userName: String!, email: String!, password: String!, bio: String, avatar: String ): User
  }
`;
