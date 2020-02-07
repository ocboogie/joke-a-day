import { Container } from "typedi";
import LoggerInstance from "./logger";
import * as TypeORM from "typeorm";

export default () => {
  try {
    Container.set("logger", LoggerInstance);
    TypeORM.useContainer(Container);
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};
