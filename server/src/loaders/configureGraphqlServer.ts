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
    // HACKY: This whole area I don't fully understand but hey it works.
    // This is done to get the request and cookies when in a subscription
    // resolver.
    context: ctx => ctx.connection?.context || ctx,
    subscriptions: {
      async onConnect(connectionParams, webSocket) {
        // webSocket.upgradeReq isn't ran through the express middleware
        // so we have to do it manually
        const req = await new Promise(resolve => {
          // @ts-ignore
          cookieParser()(webSocket.upgradeReq, {}, () => {
            // @ts-ignore
            resolve(webSocket.upgradeReq);
          });
        });

        return { req };
      }
    }
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
