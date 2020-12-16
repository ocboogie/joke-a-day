import Post from "../models/Post";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Resolver, Mutation, Arg, PubSub, Publisher } from "type-graphql";
import User from "../models/User";
import { CurrentUser } from "../decorators/auth";
import Vote from "../models/Vote";

@Resolver((of) => Post)
export default class {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  async vote(postId: string, user: User, voteValue: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["prompt"],
    });
    if (!post) {
      // FIXME:
      throw new Error("Post not found");
    }
    if (!(await post.prompt).isCurrent()) {
      // FIXME:
      throw new Error("Prompt is not active");
    }

    const vote = this.voteRepository.create({
      vote: voteValue,
      post: { id: postId },
      voter: user,
    });
    await this.voteRepository.save(vote);
    return post;
  }

  @Mutation((returns) => Post)
  async upvote(
    @Arg("postId") postId: string,
    @CurrentUser() user: User,
    @PubSub("POST_UPDATED") publish: Publisher<Post>
  ) {
    const post = await this.vote(postId, user, 1);
    publish(post);
    return post;
  }

  @Mutation((returns) => Post)
  async downvote(
    @Arg("postId") postId: string,
    @CurrentUser() user: User,
    @PubSub("POST_UPDATED") publish: Publisher<Post>
  ) {
    const post = await this.vote(postId, user, -1);
    publish(post);
    return post;
  }

  @Mutation((returns) => Post)
  async unvote(
    @Arg("postId") postId: string,
    @CurrentUser() user: User,
    @PubSub("POST_UPDATED") publish: Publisher<Post>
  ) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["prompt"],
    });
    if (!post) {
      // FIXME:
      throw new Error("Post not found");
    }
    if (!(await post.prompt).isCurrent()) {
      // FIXME:
      throw new Error("Prompt is not active");
    }
    await this.voteRepository.delete({ post: post, voter: user });
    publish(post);
    return post;
  }
}
