import { getRepository } from "typeorm";
import Prompt from "../models/Prompt";
import User from "../models/User";
import Post from "../models/Post";

export default async () => {
  const promptRepo = getRepository(Prompt);
  const userRepo = getRepository(User);
  const postRepo = getRepository(Post);

  const normalUser = await userRepo.findOne({ where: { admin: false } });

  const prompt = await promptRepo.save({
    content: "Hello _____!",
    scheduled: Prompt.ScheduleDateFormat(new Date(Date.now())),
  });

  if (normalUser) {
    postRepo.save({
      authorId: normalUser.id,
      promptId: prompt.id,
      content: "World",
    });
  }
};
