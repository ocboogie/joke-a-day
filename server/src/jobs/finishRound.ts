import { Container } from "typedi";
import { getCustomRepository } from "typeorm";
import MailgunInstance from "../loaders/mailgun";
import LoggerInstance from "../loaders/logger";
import { finishRound } from "../queues";
import Prompt from "../models/Prompt";
import PromptRepo from "../customRepos/Prompt";
import RoundManagement from "../services/roundManagement";

finishRound.process(async job => {
  const logger = Container.get("logger") as typeof LoggerInstance;
  const mailgun = Container.get("mailgun") as typeof MailgunInstance;
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
      relations: ["posts", "posts.author"]
    });

    if (!prompt) {
      logger.error("No current prompt");
      // FIXME:
      throw new Error("No current prompt");
    }
  }

  const winners = await roundManagement.computeWinners(prompt);

  if (winners) {
    prompt.winners = winners;
    try {
      await Promise.all(
        winners.map(user =>
          mailgun.messages().send({
            from: "Test 123 <hello@world.com>",
            to: user.email,
            subject: "You won!",
            text: "You've won a prompt"
          })
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  await promptRepository.save(prompt);
});
