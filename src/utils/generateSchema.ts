import * as fs from 'fs';
import * as path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from '@graphql-tools/merge';

export const genSchema = () => {
  const schemas: GraphQLSchema[] = [];

  const folders = fs.readdirSync(path.join(__dirname, '../modules'));
  folders.forEach(async (folder) => {
    const { resolvers } = require(`../modules/${folder}/resolvers`);
    const { typeDefs } = require(`../modules/${folder}/schema`);

    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  return mergeSchemas({ schemas });
};
