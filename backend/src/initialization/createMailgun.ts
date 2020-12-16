import { Container } from "typedi";
import mailgun from "mailgun-js";
import { Logger } from "winston";
import config from "../config";

export default () => {
  let apiKey = config.mailgunApiKey;
  let domain = config.mailgunDoamainName;
  let testMode = false;
  const logger = Container.get("logger") as Logger;

  if (!apiKey || !domain || config.mailgunTestMode) {
    apiKey = apiKey || "";
    domain = domain || "";
    testMode = true;
    if (!config.development) {
      throw "You must supply the MAILGUN_API_KEY and MAILGUN_DOAMAIN_NAME environment variables in production";
    }
    logger.warn("Runing mailgun in test mode");
  }

  return mailgun({
    apiKey,
    domain,
    testMode,
  });
};
