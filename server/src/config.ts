import * as dotenv from "dotenv";

dotenv.config();

const {
  HASING_MEMORY_COST,
  HASING_TIME_COST,
  LOG_LEVEL,
  SESSION_LIFETIME_DAYS,
  REMEMBER_ME_SESSION_LIFETIME_DAYS,
  INVITATION_LIFETIME_DAYS,
  PORT
} = process.env;

export default {
  // TODO: Document this
  development: process.env.NODE_ENV === "development",
  port: PORT ? parseInt(PORT) : 4000,
  hasingMemoryCost: HASING_MEMORY_COST ? parseInt(HASING_MEMORY_COST) : 4096,
  hasingTimeCost: HASING_TIME_COST ? parseInt(HASING_TIME_COST) : 3,
  sessionLifetimeDays: SESSION_LIFETIME_DAYS
    ? parseInt(SESSION_LIFETIME_DAYS)
    : 1,
  rememberMeSessionLifetimeDays: REMEMBER_ME_SESSION_LIFETIME_DAYS
    ? parseInt(REMEMBER_ME_SESSION_LIFETIME_DAYS)
    : 7,
  logLevel: LOG_LEVEL || "silly"
};
