import * as TypeORM from "typeorm";
import Container from "typedi";
import createTypeORMConnection from "./createTypeORMConnection";
import configureGraphqlServer from "./configureGraphqlServer";
import startCronJobs from "./startCronJobs";
import createLogger from "./createLogger";
import createMailgun from "./createMailgun";
import seed from "./seed";
import "../jobs";
import config from "../config";

export default async () => {
  Container.set("logger", createLogger());
  // createMailgun must go after logger because it uses the logger
  Container.set("mailgun", createMailgun());

  TypeORM.useContainer(Container);

  await createTypeORMConnection();
  startCronJobs();

  if (config.development) {
    seed();
  }

  return configureGraphqlServer();
};
