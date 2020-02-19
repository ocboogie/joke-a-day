import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Repository
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import User from "./User";
import { Lazy } from ".";

@ObjectType()
@Entity()
export default class Session {
  @Field()
  @PrimaryColumn({ length: 64 })
  id: string;

  @Column({ type: "timestamp" })
  expires: Date;

  @Column()
  userId: string;

  @Field(type => User)
  @ManyToOne(type => User, { lazy: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: Lazy<User>;

  // TODO: This probably shouldn't exist
  public async vaild(sessionRepository: Repository<Session>) {
    if (this.expires.getTime() < Date.now()) {
      await sessionRepository.delete({ id: this.id });
      return false;
    }
    return true;
  }
}