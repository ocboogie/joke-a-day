import * as dotenv from "dotenv";
import ms from "ms";

dotenv.config();

const {
  HASING_MEMORY_COST,
  HASING_TIME_COST,
  LOG_LEVEL,
  SESSION_LIFETIME,
  REMEMBER_ME_SESSION_LIFETIME,
  PORT,
  MAILGUN_API_KEY,
  MAILGUN_DOAMAIN_NAME,
  MAILGUN_TEST_MODE,
} = process.env;

export default {
  // TODO: Document this
  development: process.env.NODE_ENV === "development",
  port: PORT ? parseInt(PORT) : 4000,
  hasingMemoryCost: HASING_MEMORY_COST ? parseInt(HASING_MEMORY_COST) : 4096,
  hasingTimeCost: HASING_TIME_COST ? parseInt(HASING_TIME_COST) : 3,
  sessionLifetime: ms(SESSION_LIFETIME || "1d"),
  rememberMeSessionLifetime: ms(REMEMBER_ME_SESSION_LIFETIME || "7d"),
  logLevel: LOG_LEVEL || "silly",
  mailgunApiKey: MAILGUN_API_KEY,
  mailgunDoamainName: MAILGUN_DOAMAIN_NAME,
  mailgunTestMode: MAILGUN_TEST_MODE?.toLowerCase() == "true",
};
