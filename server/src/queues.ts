import Queue from "bull";

export const finishRound = new Queue("finishRound");
