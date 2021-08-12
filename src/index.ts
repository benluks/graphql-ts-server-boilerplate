const express = require('express');
import { ApolloServer } from 'apollo-server-express';
import { createTypeormConn } from './utils/createTypeormConn';

import { redis } from './redis';
import { confirmEmail } from './routes/confirmEmail';
import { genSchema } from './utils/generateSchema';

export const startServer = async () => {
  const app = express();
  const server = new ApolloServer({
    schema: genSchema(),
    context: ({ req }) => ({
      redis,
      url: req.protocol + '://' + req.get('host'),
    }),
  });

  app.get('/confirm/:id', confirmEmail);

  await createTypeormConn();
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return app;
};

startServer();
