import Post from "./post";
import Prompt from "./prompt";
import User from "./user";
import Vote from "./vote";
import { BuildSchemaOptions } from "type-graphql";

// For some reason TypeScript can't see that this array can be used as the
// resolvers field when building the schema, so we have to explicitly tell it
// what it is.
export default [Post, Prompt, User, Vote] as BuildSchemaOptions["resolvers"];
