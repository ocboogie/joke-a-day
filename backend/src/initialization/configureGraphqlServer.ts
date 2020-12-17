import http from "http";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import express from "express";
import {
  ApolloServer,
  ApolloError,
  ValidationError,
} from "apollo-server-express";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { GraphQLError } from "graphql";
import { v4 } from "uuid";
import { Logger } from "winston";

import resolvers from "../resolvers";
import cookieParser from "cookie-parser";
import User from "../models/User";

const context = ({ req, res }: ExpressContext) => ({
  req,
  res,
  user: null as null | User,
});

export type Context = ReturnType<typeof context>;

export default async () => {
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: true,
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    // https://youtu.be/7oLczJD6zZI
    formatError(error: GraphQLError) {
      // Expose all ApolloErrors to the user. These are considered "expected"
      // errors.
      if (error instanceof ApolloError) {
        return error;
      }

      const logger = Container.get("logger") as Logger;

      const errId = v4();
      logger.error(`Internal server error "${errId}": ${error.message}`, {
        error,
        errId,
      });

      return new GraphQLError(
        `Internal Error: ${errId}`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        { id: errId, code: "INTERNAL_SERVER_ERROR" }
      );
    },
    // HACKY: This whole area I don't fully understand but hey it works.
    // This is done to get the request and cookies when in a subscription
    // resolver.
    context: (ctx) => ctx.connection?.context || ctx,
    subscriptions: {
      async onConnect(_connectionParams, webSocket) {
        // webSocket.upgradeReq isn't ran through the express middleware
        // so we have to do it manually
        const req = await new Promise((resolve) => {
          // @ts-ignore
          cookieParser()(webSocket.upgradeReq, {}, () => {
            // @ts-ignore
            resolve(webSocket.upgradeReq);
          });
        });

        return { req };
      },
    },
  });

  const app = express();

  app.use(cookieParser());

  server.applyMiddleware({
    app,
    path: "/",
    cors: {
      origin: "http://localhost:8080",
      credentials: true,
    },
  });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  return { app, server, httpServer };
};
