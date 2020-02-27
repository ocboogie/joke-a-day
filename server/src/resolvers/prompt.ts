import {
  Arg,
  Query,
  Resolver,
  Mutation,
  Ctx,
  Authorized,
  Subscription,
  Root
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import LoggerInstance from "../loaders/logger";
import { Inject } from "typedi";
import { Admin, CurrentUser } from "../decorators/auth";
import Prompt from "../models/Prompt";
import { PromptInfo } from "./types/prompt";
import User from "../models/User";
import Post from "../models/Post";
import post from "./post";

@Resolver(of => Prompt)
export default class {
  constructor(
    @InjectRepository(Prompt)
    private readonly promptRepository: Repository<Prompt>,
    @Inject("logger") private logger: typeof LoggerInstance
  ) {}

  @Admin()
  @Mutation(returns => Prompt)
  async createPrompt(@Arg("prompt") prompt: PromptInfo) {
    this.logger.info(`Created a new prompt: ${prompt.content}`, { prompt });
    return this.promptRepository.save({
      ...prompt,
      scheduled: Prompt.ScheduleDateFormat(prompt.scheduled)
    });
  }

  @Query(returns => [Prompt])
  prompts() {
    return this.promptRepository.find();
  }

  @Query(returns => Prompt, { nullable: true })
  prompt(@Arg("id") id: string) {
    return this.promptRepository.findOne(id);
  }

  @Query(returns => Prompt, { nullable: true })
  currentPrompt() {
    // TODO: Make sure this is current with the whole time zone thing
    const today = new Date(Date.now());

    return this.promptRepository.findOne({
      where: { scheduled: Prompt.ScheduleDateFormat(today) }
    });
  }

  @Subscription({
    topics: "POST_ADDED",
    filter: ({ args, payload }) => payload.promptId === args.promptId
  })
  postAdded(@Root() newPost: Post, @Arg("promptId") promptId: string): Post {
    return newPost;
  }

  @Subscription({
    topics: "POST_UPDATED",
    filter: ({ args, payload }) => payload.promptId === args.promptId
  })
  postUpdated(
    @Root() updatedPost: Post,
    @Arg("promptId") promptId: string
  ): Post {
    return updatedPost;
  }
}
