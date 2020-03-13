import { finishRound } from "../queues";

export default () => {
  finishRound.add(null, { repeat: { cron: "0 0 * * *" } });
};
