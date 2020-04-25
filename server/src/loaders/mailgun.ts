import mailgun from "mailgun-js";
import config from "../config";
import logger from "./logger";

let apiKey = config.mailgunApiKey;
let domain = config.mailgunDoamainName;
let testMode = false;

if (!apiKey || !domain || config.mailgunTestMode) {
  apiKey = apiKey || "";
  domain = domain || "";
  testMode = true;
  if (!config.development) {
    throw "You must supply the MAILGUN_API_KEY and MAILGUN_DOAMAIN_NAME environment variables in production";
  }
  logger.warn("Runing mailgun in test mode");
}

export default mailgun({
  apiKey,
  domain,
  testMode,
});
