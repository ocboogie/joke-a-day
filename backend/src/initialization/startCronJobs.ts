import { finishUncompleteRounds } from "../queues";

export default () => {
  finishUncompleteRounds.add(null, { repeat: { cron: "1 0 * * *" } });
};
