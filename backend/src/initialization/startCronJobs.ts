import { finishRound } from "../queues";

export default () => {
  finishRound.add(null, { repeat: { cron: "1 0 * * *" } });
};
