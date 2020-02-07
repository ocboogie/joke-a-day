import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  Repository,
  JoinColumn
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import User from "./User";
import { Lazy } from ".";
import Prompt from "./Prompt";

@ObjectType()
@Entity()
export default class Post {
  static BaseSelector(postRepository: Repository<Post>) {
    return postRepository
      .createQueryBuilder()
      .select()
      .addSelect("COALESCE(SUM(`votes`.`vote`), 0)", "upvotes");
  }

  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ length: 256 })
  content: string;

  @Field(type => User)
  @ManyToOne(type => User, { lazy: true })
  author: Lazy<User>;

  @Column()
  promptId: string;

  @ManyToOne(type => Prompt, { lazy: true })
  @JoinColumn({ name: "promptId" })
  prompt: Lazy<Prompt>;

  @CreateDateColumn()
  createdAt: Date;
}
