import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable
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

  @Field()
  @Column({ default: true })
  active: boolean;

  @Field(type => [Post])
  @OneToMany(
    type => Post,
    post => post.prompt,
    { lazy: true }
  )
  posts: Lazy<Post[]>;

  @Field(type => [User])
  @ManyToMany(
    type => User,
    user => user.wins,
    { lazy: true }
  )
  @JoinTable()
  winners: Lazy<User[]>;

  public isCurrent(): boolean {
    const today = Prompt.ScheduleDateFormat(new Date(Date.now()));
    return this.scheduled === today && this.active;
  }

  /**
   * Return the authors of the highest upvoted posts. Typically, this should
   * return one user but if there are multiple posts tied for first then this
   * returns an array of users.
   *
   * @returns the winner(s) of this prompt and undefied if there aren't any posts
   */
  public async computeWinners() {
    const posts = await this.posts;

    if (!posts.length) {
      return;
    }

    let max = -Infinity;
    const winners: Set<User> = new Set();

    await Promise.all(
      posts.map(async post => {
        const upvotes = await post.upvotes;
        if (upvotes > max) {
          winners.clear();
          max = upvotes;
        }
        if (upvotes === max) {
          winners.add(await post.author);
        }
      })
    );

    return [...winners];
  }
}
