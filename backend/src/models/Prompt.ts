import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import User from "./User";
import Post from "./Post";
import { Lazy } from ".";

export const maxContentLength = 256;

export enum Status {
  Future,
  Current,
  Archived,
}

@ObjectType()
@Entity()
export default class Prompt {
  // https://stackoverflow.com/a/23593099/4910911
  static ScheduleDateFormat(date: Date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return [year, month, day].join("-");
  }

  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ length: maxContentLength })
  content: string;

  @Field()
  @Column({ type: "date" })
  scheduled: string;

  @Field((type) => [Post])
  @OneToMany((type) => Post, (post) => post.prompt, { lazy: true })
  posts: Lazy<Post[]>;

  @Field((type) => [User])
  @ManyToMany((type) => User, (user) => user.wins, {
    lazy: true,
    cascade: true,
  })
  @JoinTable()
  winners: Lazy<User[]>;

  /**
   * Denotes if the prompt has been processed and a winner or winners have been
   * declared.
   */
  @Column({ default: false })
  complete: boolean;

  /**
   * Get the status of this prompt, current, archived or future.
   */
  public getStatus(): Status {
    const today = Prompt.ScheduleDateFormat(new Date(Date.now()));
    // This is doing string comparing but still works because of the format
    // the dates are in.
    if (this.scheduled > today) {
      return Status.Future;
    } else if (this.scheduled < today) {
      return Status.Archived;
    } else {
      return Status.Current;
    }
  }
}
