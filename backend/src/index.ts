import "reflect-metadata";
import initialize from "./initialization";
import config from "./config";

async function bootstrap() {
  const { server, httpServer } = await initialize();

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
