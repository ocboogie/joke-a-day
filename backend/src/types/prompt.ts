import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";
import { maxContentLength } from "../models/Prompt";

@InputType()
export class PromptInfo {
  @Length(1, maxContentLength)
  @Field()
  content: string;

  @Field()
  scheduled: Date;
}
