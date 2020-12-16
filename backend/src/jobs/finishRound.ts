import { Container } from "typedi";
import { getCustomRepository } from "typeorm";
import { Logger } from "winston";
import { finishRound } from "../queues";
import Prompt from "../models/Prompt";
import PromptRepo from "../customRepos/Prompt";
import RoundManagement from "../services/roundManagement";

finishRound.process(async (job) => {
  const logger = Container.get("logger") as Logger;
  const roundManagement = Container.get(RoundManagement);
  const promptRepository = getCustomRepository(PromptRepo);
  logger.info("Starting to finish the round");

  let prompt;

  if (job.data) {
    prompt = promptRepository.create(job.data);
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    prompt = await promptRepository.findOne({
      where: { scheduled: Prompt.ScheduleDateFormat(yesterday) },
      relations: ["posts", "posts.author"],
    });

    if (!prompt) {
      logger.error(
        "Tried to finish the current round but there is no current prompt"
      );
      // FIXME:
      throw new Error("No current prompt");
    }
  }

  await roundManagement.finishRound(prompt);
});
