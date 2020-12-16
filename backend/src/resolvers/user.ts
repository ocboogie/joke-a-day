import { Arg, Query, Resolver, Mutation, Ctx, Authorized } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Logger } from "winston";
import {
  ForbiddenError,
  AuthenticationError,
  UserInputError,
} from "apollo-server";
import { Response } from "express";
import { Inject } from "typedi";
import { Context } from "../initialization/configureGraphqlServer";
import { CurrentUser } from "../decorators/auth";
import AuthService, { EmailInUseError } from "../services/auth";
import { UserInfo, UserLogin, LoginResult } from "../types/user";
import Session from "../models/Session";
import User from "../models/User";
import config from "../config";

async function saveSession(
  res: Response,
  session: Session,
  sessionId: string,
  rememberMe: boolean = false
) {
  res.cookie("sessionId", sessionId, {
    // TODO: Test when "rememberMe" is flase if the cookie will be a session cookie
    expires: rememberMe ? session.expires : undefined,
    httpOnly: true,
    secure: !config.development,
  });
}

@Resolver((of) => User)
export default class {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @Inject("logger") private logger: Logger,
    private readonly authService: AuthService
  ) {}

  @Mutation((returns) => LoginResult)
  async signUp(@Arg("user") userInput: UserInfo, @Ctx() { res }: Context) {
    try {
      const { user, session, sessionId } = await this.authService.signUp(
        userInput
      );

      saveSession(res, session, sessionId, true);

      return {
        user,
        sessionId,
      };
    } catch (err) {
      if (err instanceof EmailInUseError) {
        throw new UserInputError("Email already in use", { email: err.email });
      }
      throw err;
    }
  }

  @Mutation((returns) => LoginResult)
  async login(
    @Arg("user") { email, password, rememberMe }: UserLogin,
    @Ctx() { res }: Context
  ) {
    try {
      const { user, session, sessionId } = await this.authService.login(
        email,
        password,
        rememberMe
      );

      saveSession(res, session, sessionId, rememberMe);

      return {
        user,
        sessionId,
      };
    } catch (err) {
      // FIXME: Use a better error
      throw new AuthenticationError("Login failed");
    }
  }

  @Mutation((returns) => Boolean)
  async logout(@Ctx() { req }: Context) {
    const { sessionId } = req.cookies;
    if (!sessionId) {
      return false;
    }

    await this.authService.logout(sessionId);

    return true;
  }

  @Mutation((returns) => User)
  async changeUsername(
    @CurrentUser() user: User,
    @Arg("userId") userId: string,
    @Arg("username") username: string
  ) {
    if (!user.canModify(userId)) {
      throw new ForbiddenError("You don't have access to this user");
    }

    user.name = username;
    this.userRepository.save(user);

    return user;
  }

  @Query((returns) => Boolean)
  signedIn(@CurrentUser(false) user: User) {
    return Boolean(user);
  }

  @Query((returns) => User)
  me(@CurrentUser(true) user: User) {
    return user;
  }
}
