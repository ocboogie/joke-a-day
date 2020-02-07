import http from "http";
import { buildSchema, AuthChecker } from "type-graphql";
import { Container } from "typedi";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

import resolvers from "../resolvers";
import cookieParser from "cookie-parser";
import User from "../models/User";

const context = ({ req, res }: ExpressContext) => ({
  req,
  res,
  user: null as null | User
});

export type Context = ReturnType<typeof context>;

export default async () => {
  const schema = await buildSchema({
    resolvers: resolvers,
    emitSchemaFile: true,
    container: Container
  });

  const server = new ApolloServer({
    schema,
    // TODO: This might not be necessary
    context: ({ req, res }) => ({ req, res })
  });

  const app = express();

  app.use(cookieParser());

  server.applyMiddleware({
    app,
    path: "/",
    cors: {
      origin: "http://localhost:8080",
      credentials: true
    }
  });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  return { app, server, httpServer };
};
