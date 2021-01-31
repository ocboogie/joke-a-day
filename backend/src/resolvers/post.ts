import Post from "../models/Post";
import { Repository } from "typeorm";
import { Inject } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import {
  Resolver,
  Mutation,
  Arg,
  PubSub,
  Publisher,
  FieldResolver,
  Root,
} from "type-graphql";
import User from "../models/User";
import { CurrentUser, Admin } from "../decorators/auth";
import PromptRepo from "../customRepos/Prompt";
import Vote from "../models/Vote";
import RoundManagement from "../services/roundManagement";
import { ForbiddenError } from "apollo-server";
import { Logger } from "winston";
import { Status } from "../models/Prompt";

@Resolver((of) => Post)
export default class {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PromptRepo)
    private readonly promptRepository: PromptRepo,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @Inject("logger") private logger: Logger,
    private readonly roundManagementService: RoundManagement
  ) {}

  @Mutation((returns) => Post)
  async createPost(
    @Arg("promptId") promptId: string,
    @Arg("content") content: string,
    @CurrentUser() user: User,
    @PubSub("POST_ADDED") publish: Publisher<Post>
  ) {
    const prompt = await this.promptRepository.findOne(promptId);

    if (!prompt) {
      // FIXME:
      throw new Error("Prompt not found");
    }
    if (prompt.getStatus() != Status.Current) {
      // FIXME:
      throw new Error("Prompt is not active");
    }

    const post = this.postRepository.create({
      promptId,
      author: user,
      content,
    });
    await this.postRepository.insert(post);
    await publish(post);
    this.logger.silly(`Created a new post: ${post.content}`, { post });
    return post;
  }

  @Mutation((returns) => Boolean)
  async deletePost(
    @Arg("postId") postId: string,
    @CurrentUser() user: User,
    @PubSub("POST_DELETED") publish: Publisher<Post>
  ) {
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      // FIXME:
      throw new Error("Post not found");
    }

    if (!user.canModify(post.authorId)) {
      throw new ForbiddenError("You don't have access to delete this post");
    }

    await this.postRepository.delete(post.id);

    publish(post);
    this.logger.info(
      `User "${user.name}" deleted post with content of "${post.content}"`,
      { user, post }
    );

    return true;
  }

  @FieldResolver((type) => Number)
  async upvotes(@Root() post: Post): Promise<number> {
    return this.roundManagementService.computeUpvotes(post);
  }

  @FieldResolver((type) => Number)
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
