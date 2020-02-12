import { Container } from "typedi";
import { Repository } from "typeorm";
import LoggerInstance from "../loaders/logger";
import { finishRound } from "../queues";
import Prompt from "../models/Prompt";
import Post from "../models/Post";

finishRound.process(async () => {
  const logger = Container.get("logger") as typeof LoggerInstance;
  const promptRepository = Container.get("PromptModel") as Repository<Prompt>;
  const postRepository = Container.get("PostModel") as Repository<Post>;

  const today = new Date(Date.now());

  const currentPrompt = await promptRepository.findOne({
    where: { scheduled: Prompt.ScheduleDateFormat(today) }
  });

  if (!currentPrompt) {
    throw new Error("No current prompt");
  }

  const posts = await postRepository.find({ where: { prompt: currentPrompt } });

  if (!posts.length) {
    return;
  }

  let max = -Infinity;
  const winners: Set<string> = new Set();

  Promise.all(
    posts.map(async post => {
      const upvotes = await post.upvotes;
      if (upvotes > max) {
        winners.clear();
        max = upvotes;
      }
      if (upvotes === max) {
        winners.add(post.authorId);
      }
    })
  );

  console.log(winners);
});
