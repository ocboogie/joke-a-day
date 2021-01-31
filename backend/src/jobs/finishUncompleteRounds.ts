import { Container } from "typedi";
import { getCustomRepository, LessThan } from "typeorm";
import { Logger } from "winston";
import { finishUncompleteRounds } from "../queues";
import Prompt from "../models/Prompt";
import PromptRepo from "../customRepos/Prompt";
import RoundManagement from "../services/roundManagement";

finishUncompleteRounds.process(async () => {
  const logger = Container.get("logger") as Logger;
  const roundManagement = Container.get(RoundManagement);
  const promptRepository = getCustomRepository(PromptRepo);

  const today = new Date();

  const prompts = await promptRepository.find({
    where: {
      scheduled: LessThan(Prompt.ScheduleDateFormat(today)),
      complete: false,
    },
    relations: ["posts", "posts.author"],
  });

  logger.info(
    `Finishing uncompleted rounds: ${prompts
      .map((prompt) => prompt.id)
      .join(", ")}`
  );

  await Promise.all(
    // Must bind `roundManagement` otherwise `this` won't be set correctly, and
    // you have to spend like an hour trying to debug because for some reason
    // thrown errors in a queue aren't logged!
    prompts.map(roundManagement.finishRound.bind(roundManagement))
  );
});
