import {
  Arg,
  Query,
  Resolver,
  Mutation,
  Subscription,
  Root,
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Inject } from "typedi";
import { Admin } from "../decorators/auth";
import Prompt from "../models/Prompt";
import PromptRepo from "../customRepos/Prompt";
import { PromptInfo } from "../types/prompt";
import Post from "../models/Post";
import { Logger } from "winston";
import { finishUncompleteRounds } from "../queues";
import RoundManagement from "../services/roundManagement";

@Resolver((of) => Prompt)
export default class {
  constructor(
    @InjectRepository(PromptRepo)
    private readonly promptRepository: PromptRepo,
    @Inject("logger") private logger: Logger,
    private readonly roundManagement: RoundManagement
  ) {}

  @Admin()
  @Mutation((returns) => Prompt)
  async createPrompt(@Arg("prompt") prompt: PromptInfo) {
    this.logger.info(`Created a new prompt: ${prompt.content}`, { prompt });
    return this.promptRepository.save({
      ...prompt,
      scheduled: Prompt.ScheduleDateFormat(prompt.scheduled),
    });
  }

  @Query((returns) => [Prompt])
  prompts() {
    return this.promptRepository.allActive();
  }

  @Query((returns) => Prompt, { nullable: true })
  prompt(@Arg("id") id: string) {
    return this.promptRepository.findActiveById(id);
  }

  @Query((returns) => Prompt, { nullable: true })
  currentPrompt() {
    return this.promptRepository.findCurrent();
  }

  @Mutation((returns) => Prompt)
  @Admin()
  async manuallyFinishRound(@Arg("id") id: string): Promise<Prompt> {
    const prompt = await this.promptRepository.findOne(id);
    if (!prompt) {
      // FIXME:
      throw "Prompt not found";
    }

    this.roundManagement.finishRound(prompt);

    return prompt;
  }

  @Mutation((returns) => Boolean)
  @Admin()
  async triggerFinishUncompleteRounds(): Promise<true> {
    finishUncompleteRounds.add(null);

    return true;
  }

  @Subscription({
    topics: "POST_ADDED",
    filter: ({ args, payload }) => payload.promptId === args.promptId,
  })
  postAdded(@Root() newPost: Post, @Arg("promptId") promptId: string): Post {
    return newPost;
  }

  @Subscription({
    topics: "POST_DELETED",
    filter: ({ args, payload }) => payload.promptId === args.promptId,
  })
  postDeleted(
    @Root() removedPost: Post,
    @Arg("promptId") promptId: string
  ): string {
    return removedPost.id;
  }

  @Subscription({
    topics: "POST_UPDATED",
    filter: ({ args, payload }) => payload.promptId === args.promptId,
  })
  postUpdated(
    @Root() updatedPost: Post,
    @Arg("promptId") promptId: string
  ): Post {
    return updatedPost;
  }
}
