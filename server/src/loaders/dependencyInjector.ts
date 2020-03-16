import { Container } from "typedi";
import LoggerInstance from "./logger";
import MailgunInstance from "./mailgun";
import * as TypeORM from "typeorm";

export default () => {
  try {
    Container.set("logger", LoggerInstance);
    TypeORM.useContainer(Container);
    Container.set("mailgun", MailgunInstance);
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};
