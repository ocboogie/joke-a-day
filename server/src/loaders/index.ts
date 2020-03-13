import dependencyInjectorLoader from "./dependencyInjector";
import connectToDb from "./typeorm";
import configureGraphqlServer from "./configureGraphqlServer";
import "../jobs";
import startCronJobs from "./startCronJobs";

export default async () => {
  await dependencyInjectorLoader();
  await connectToDb();
  startCronJobs();
  return configureGraphqlServer();
};
