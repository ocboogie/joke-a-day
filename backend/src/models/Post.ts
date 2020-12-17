import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  RelationId,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import User from "./User";
import { Lazy } from ".";
import Prompt from "./Prompt";

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
  @RelationId((post: Post) => post.author)
  authorId: string;

  @Field((type) => User)
  @ManyToOne((type) => User, { lazy: true })
  author: Lazy<User>;

  @Column()
  @RelationId((post: Post) => post.prompt)
  promptId: string;

  @ManyToOne((type) => Prompt, { lazy: true })
  prompt: Lazy<Prompt>;

  @CreateDateColumn()
  createdAt: Date;
}
