import Post from "../models/Post";
import { Repository } from "typeorm";
import LoggerInstance from "../loaders/logger";
import { Inject } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import {
  Resolver,
  Mutation,
  Arg,
  PubSub,
  PubSubEngine,
  Publisher,
  FieldResolver,
  Root
} from "type-graphql";
import User from "../models/User";
import { CurrentUser } from "../decorators/auth";
import Prompt from "../models/Prompt";
import Vote from "../models/Vote";
import vote from "./vote";

@Resolver(of => Post)
export default class {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Prompt)
    private readonly promptRepository: Repository<Prompt>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @Inject("logger") private logger: typeof LoggerInstance
  ) {}

  @Mutation(returns => Post)
  async createPost(
    @Arg("promptId") promptId: string,
    @Arg("content") content: string,
    @CurrentUser() user: User,
    @PubSub("POST_NEW") publish: Publisher<Post>
  ) {
    const prompt = await this.promptRepository.findOne(promptId);

    if (!prompt) {
      // FIXME:
      throw new Error("Prompt not found");
    }
    if (!prompt.isCurrent()) {
      // FIXME:
      throw new Error("Prompt is not active");
    }

    const post = this.postRepository.create({
      prompt: { id: promptId },
      author: user,
      content
    });
    await this.postRepository.insert(post);
    await publish(post);
    this.logger.silly(`Created a new post: ${post.content}`, { post });
    return post;
  }

  @FieldResolver(type => Number)
  async upvotes(@Root() post: Post): Promise<number> {
    return post.upvotes;
  }

  @FieldResolver(type => Number)
  async userVote(
    @Root() post: Post,
    @CurrentUser(false) user?: User
  ): Promise<number> {
    if (!user) {
      return 0;
    }

    const vote = await this.voteRepository.findOne({ where: { post, user } });

    if (!vote) {
      return 0;
    }

    return vote.vote;
  }
}