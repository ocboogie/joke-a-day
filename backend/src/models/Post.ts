import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
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
}