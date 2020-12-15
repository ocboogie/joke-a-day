import Queue from "bull";
import Prompt from "./models/Prompt";
import config from "./config";

const queueConfig = {
  redis: {
    port: config.redisPort,
    host: config.redisHost,
  },
};

export const finishRound = new Queue<Prompt | null>("finishRound", queueConfig);
