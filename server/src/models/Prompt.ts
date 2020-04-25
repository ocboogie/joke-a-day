import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import User from "./User";
import Post from "./Post";
import { Lazy } from ".";

export const maxContentLength = 256;

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
  @ManyToMany((type) => User, (user) => user.wins, { lazy: true })
  @JoinTable()
  winners: Lazy<User[]>;

  /**
   * If the prompt is scheduled for today
   */
  public isCurrent(): boolean {
    const today = Prompt.ScheduleDateFormat(new Date(Date.now()));
    return this.scheduled === today;
  }
}
