import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    hello(name: String): String!
  }
`;
