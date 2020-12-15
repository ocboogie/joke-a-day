import "reflect-metadata";
import loaders from "./loaders";
import config from "./config";

async function bootstrap() {
  const { server, app, httpServer } = await loaders();

  httpServer.listen(config.port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${config.port}${server.subscriptionsPath}`
    );
  });

  // app.listen(config.port, () =>
  //   console.log(
  //     `🚀 Server ready at localhost:${config.port}${server.graphqlPath}`
  //   )
  // );

  // console.log(`🚀 Server ready at ${url}`);
}

bootstrap();
