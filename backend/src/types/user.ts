import { Field, InputType, ObjectType } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import User, { maxNameLength } from "../models/User";

@InputType()
export class UserCredentials {
  @IsEmail()
  @Field()
  email: string;

  @Length(5, 512)
  @Field()
  password: string;
}

@InputType()
export class UserInfo extends UserCredentials {
  @Length(1, maxNameLength)
  @Field()
  name: string;
}

@InputType()
export class UserLogin extends UserCredentials {
  @Field()
  rememberMe: boolean = false;
}

@ObjectType()
export class LoginResult {
  @Field()
  sessionId: string;

  @Field()
  user: User;
}
