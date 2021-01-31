import Queue from "bull";
import config from "./config";

const queueConfig = {
  redis: {
    port: config.redisPort,
    host: config.redisHost,
  },
};

export const finishUncompleteRounds = new Queue<null>(
  "finishUncompleteRounds",
  queueConfig
);
