import crypto from "crypto";
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Repository,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import User from "./User";
import { Lazy } from ".";

@ObjectType()
@Entity()
export default class Session {
  public static hashSessionId(id: string) {
    return crypto.createHash("sha256").update(id).digest("base64");
  }

  @Field()
  @PrimaryColumn({ length: 64 })
  id: string;

  @Column({ type: "timestamp" })
  expires: Date;

  @Column()
  userId: string;

  @Field((type) => User)
  @ManyToOne((type) => User, { lazy: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: Lazy<User>;
}
