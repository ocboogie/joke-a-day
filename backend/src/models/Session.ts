import crypto from "crypto";
import { Entity, PrimaryColumn, Column, ManyToOne, RelationId } from "typeorm";
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
  @RelationId((session: Session) => session.user)
  userId: string;

  @Field((type) => User)
  @ManyToOne((type) => User, { lazy: true, onDelete: "CASCADE" })
  user: Lazy<User>;
}
