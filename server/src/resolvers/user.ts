import crypto from "crypto";
import { Arg, Query, Resolver, Mutation, Ctx, Authorized } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { UserInfo, UserLogin, LoginResult } from "../types/user";
import Session from "../models/Session";
import User from "../models/User";
import config from "../config";
import LoggerInstance from "../loaders/logger";
import argon2 from "argon2";
import { UnauthorizedError } from "type-graphql";
import { Response } from "express";
import { Context } from "../loaders/configureGraphqlServer";
import { CurrentUser } from "../decorators/auth";
import AuthService from "../services/auth";
import { Inject } from "typedi";

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
    secure: !config.development
  });
}

@Resolver(of => User)
export default class {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @Inject("logger") private logger: typeof LoggerInstance,
    @Inject("auth.service") private readonly authService: AuthService
  ) {}

  @Mutation(returns => LoginResult)
  async signUp(@Arg("user") userInput: UserInfo, @Ctx() { res }: Context) {
    const { user, session, sessionId } = await this.authService.signUp(
      userInput
    );

    saveSession(res, session, sessionId, true);

    return {
      user,
      sessionId
    };
  }

  @Mutation(returns => LoginResult)
  async login(
    @Arg("user") { email, password, rememberMe }: UserLogin,
    @Ctx() { res }: Context
  ) {
    const { user, session, sessionId } = await this.authService.login(
      email,
      password,
      rememberMe
    );

    saveSession(res, session, sessionId, rememberMe);

    return {
      user,
      sessionId
    };
  }

  @Mutation(returns => Boolean)
  async logout(@Ctx() { req }: Context) {
    const { sessionId } = req.cookies;
    if (!sessionId) {
      return false;
    }

    await this.authService.logout(sessionId);

    return true;
  }

  @Mutation(returns => User)
  async changeUsername(
    @CurrentUser() user: User,
    @Arg("userId") userId: string,
    @Arg("username") username: string
  ) {
    if (!user.canModify(userId)) {
      throw new UnauthorizedError();
    }

    user.name = username;
    this.userRepository.save(user);

    return user;
  }

  @Query(returns => Boolean)
  signedIn(@CurrentUser(false) user: User) {
    return Boolean(user);
  }

  @Query(returns => User)
  me(@CurrentUser(true) user: User) {
    return user;
  }
}
