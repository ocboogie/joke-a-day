import Post from "./Post";
import Prompt from "./Prompt";
import Session from "./Session";
import User from "./User";
import Vote from "./Vote";

export type Lazy<T extends object> = Promise<T> | T;

export default [Post, Prompt, Session, User, Vote];
