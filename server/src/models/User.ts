import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn
} from "typeorm";

import Session from "./Session";
import { Lazy } from ".";
import { ObjectType, Field } from "type-graphql";
import Prompt from "./Prompt";
import Post from "./Post";

export const maxNameLength = 256;

@ObjectType()
@Entity()
export default class User {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ length: 320, unique: true })
  email: string;

  @Field()
  @Column({ length: maxNameLength })
  name: string;

  @Column({ length: 128 })
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(
    type => Session,
    session => session.user,
    { lazy: true }
  )
  sessions: Lazy<Session[]>;

  @Field(type => [Prompt])
  @OneToMany(
    type => Prompt,
    prompt => prompt.winner,
    { lazy: true }
  )
  wins: Lazy<Prompt[]>;

  @Field(type => [Post])
  @OneToMany(
    type => Post,
    post => post.author,
    { lazy: true }
  )
  posts: Lazy<Post[]>;

  @CreateDateColumn()
  createdAt: Date;

  canModify(userId: string): boolean {
    return userId == this.id || this.admin;
  }
}
