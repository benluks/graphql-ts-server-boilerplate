const express = require('express');
import { Request, Response } from 'express';
// import * as express from
import { ApolloServer } from 'apollo-server-express';
import { createTypeormConn } from './utils/createTypeormConn';

import * as fs from 'fs';
import * as path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from '@graphql-tools/merge';
import * as Redis from 'ioredis';
import { User } from './entity/User';

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, './modules'));
  folders.forEach(async (folder) => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const { typeDefs } = require(`./modules/${folder}/schema`);

    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  const redis = new Redis();

  const app = express();
  const server = new ApolloServer({
    schema: mergeSchemas({ schemas }),
    context: ({ req }) => ({
      redis,
      url: req.protocol + '://' + req.get('host'),
    }),
  });

  app.get('/confirm/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId: any = await redis.get(id);
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      res.send('ok');
    } else {
      res.send('invalid');
    }
  });

  await createTypeormConn();
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return app;
};

startServer();
