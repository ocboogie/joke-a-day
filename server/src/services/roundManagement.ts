import { Service, Inject } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import PromptRepository from "../customRepos/Prompt";
import LoggerInstance from "../loaders/logger";
import User from "../models/User";
import Prompt from "../models/Prompt";

@Service()
export default class RoundManagement {
  constructor(
    @InjectRepository(PromptRepository)
    private readonly promptRepository: PromptRepository,
    @Inject("logger") private logger: typeof LoggerInstance
  ) {}

  /**
   * Return the authors of the highest upvoted posts. Typically, this should
   * return one user but if there are multiple posts tied for first then this
   * returns an array of users.
   *
   * @remarks this is a pretty heavy funciton and should only been used in a
   * queue
   * @returns the winner(s) of this prompt and undefied if there aren't any posts
   */
  public async computeWinners(prompt: Prompt) {
    const posts = await prompt.posts;

    if (!posts.length) {
      return;
    }

    let max = -Infinity;
    const winners: Set<User> = new Set();

    for (const post of posts) {
      const upvotes = await post.upvotes;
      if (upvotes > max) {
        winners.clear();
        max = upvotes;
      }
      if (upvotes === max) {
        winners.add(await post.author);
      }
    }

    return [...winners];
  }
}
