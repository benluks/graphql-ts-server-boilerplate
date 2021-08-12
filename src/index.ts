const express = require('express');
import { ApolloServer } from 'apollo-server-express';
import { createTypeormConn } from './utils/createTypeormConn';
import * as session from 'express-session';
import { redis } from './redis';
import { confirmEmail } from './routes/confirmEmail';
import { genSchema } from './utils/generateSchema';

const SESSION_SECRET = 'dfwhjebqkbgi37';

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

  app.use(
    session({
      name: 'bid',
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  await createTypeormConn();
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return app;
};

startServer();
