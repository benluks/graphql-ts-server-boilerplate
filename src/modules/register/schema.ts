import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Error {
    path: String!
    message: String!
  }

  type Mutation {
    register(email: String!, password: String!): [Error!]
  }
`;
