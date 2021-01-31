import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import PromptRepository from "../customRepos/Prompt";
import User from "../models/User";
import Prompt from "../models/Prompt";
import Post from "../models/Post";
import { Repository } from "typeorm";
import Vote from "../models/Vote";
import MailService from "./mail";

@Service()
export default class RoundManagement {
  constructor(
    @InjectRepository(PromptRepository)
    private readonly promptRepository: PromptRepository,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    private readonly mailService: MailService
  ) {}

  public computeUpvotes(post: Post) {
    return this.voteRepository
      .createQueryBuilder()
      .select("COALESCE(SUM(Vote.vote), 0)", "upvotes")
      .where('"Vote"."postId" = :postId', { postId: post.id })
      .getRawOne()
      .then((vote) => Number(vote.upvotes));
  }

  /**
   * This will compute the winners of this round, save them in the db,
   * email them, and mark the prompt as complete.
   *
   * @param prompt the prompt to finish
   */
  public async finishRound(prompt: Prompt) {
    const winners = await this.computeWinners(prompt);

    if (winners) {
      prompt.winners = winners;
      // FIXME: This try block shouldn't be here and will have to be addressed
      //        by #5
      try {
        await Promise.all(
          winners.map((user) =>
            this.mailService.sendEmail(MailService.messages.win, user.email)
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
    prompt.complete = true;

    await this.promptRepository.save(prompt);
  }

  /**
   * Return the authors of the highest upvoted posts. Typically, this should
   * return one user but if there are multiple posts tied for first then this
   * returns an array of users.
   *
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
      const upvotes = await this.computeUpvotes(post);
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
