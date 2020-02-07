import dependencyInjectorLoader from "./dependencyInjector";
import connectToDb from "./typeorm";
import configureGraphqlServer from "./configureGraphqlServer";

export default async () => {
  await dependencyInjectorLoader();
  await connectToDb();
  return configureGraphqlServer();
};
