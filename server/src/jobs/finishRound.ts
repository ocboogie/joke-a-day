import { Container } from "typedi";
import { getCustomRepository } from "typeorm";
import LoggerInstance from "../loaders/logger";
import { finishRound } from "../queues";
import Prompt from "../models/Prompt";
import PromptRepo from "../customRepos/Prompt";

finishRound.process(async () => {
  const logger = Container.get("logger") as typeof LoggerInstance;
  const promptRepository = getCustomRepository(PromptRepo);
  logger.info("Starting to finish the round");

  const today = new Date(Date.now());

  const currentPrompt = await promptRepository.findOne({
    where: { scheduled: Prompt.ScheduleDateFormat(today) },
    relations: ["posts", "posts.author"]
  });

  if (!currentPrompt) {
    logger.error("No current prompt");
    // FIXME:
    throw new Error("No current prompt");
  }

  currentPrompt.archived = true;

  const winners = await currentPrompt.computeWinners();

  if (winners) {
    currentPrompt.winners = winners;
  }

  promptRepository.save(currentPrompt);
});
