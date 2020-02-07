import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Connection,
  Repository
} from "typeorm";
import User from "./User";
import Post from "./Post";

@Entity()
export default class Vote {
  @Column()
  vote: number;

  @ManyToOne(type => User, { onDelete: "CASCADE", primary: true })
  voter: User;

  @ManyToOne(type => Post, { onDelete: "CASCADE", primary: true })
  post: Post;
}
