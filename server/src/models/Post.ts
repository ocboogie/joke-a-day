import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  Repository,
  JoinColumn,
  getRepository,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import User from "./User";
import { Lazy } from ".";
import Prompt from "./Prompt";
import Vote from "./Vote";

@ObjectType()
@Entity()
export default class Post {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ length: 256 })
  content: string;

  @Column()
  authorId: string;

  @Field((type) => User)
  @ManyToOne((type) => User, { lazy: true })
  @JoinColumn({ name: "authorId" })
  author: Lazy<User>;

  @Column()
  promptId: string;

  @ManyToOne((type) => Prompt, { lazy: true })
  @JoinColumn({ name: "promptId" })
  prompt: Lazy<Prompt>;

  @CreateDateColumn()
  createdAt: Date;

  private _upvotes: number;

  get upvotes() {
    if (this._upvotes) {
      return Promise.resolve(this._upvotes);
    }
    const voteRepository = getRepository(Vote);

    return voteRepository
      .createQueryBuilder()
      .select("COALESCE(SUM(Vote.vote), 0)", "upvotes")
      .where('"Vote"."postId" = :postId', { postId: this.id })
      .getRawOne()
      .then((vote) => Number(vote.upvotes));
  }
}
