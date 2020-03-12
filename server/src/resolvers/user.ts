import crypto from "crypto";
import { Arg, Query, Resolver, Mutation, Ctx, Authorized } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { UserInfo, UserLogin, LoginResult } from "./types/user";
import Session from "../models/Session";
import User from "../models/User";
import config from "../config";
import LoggerInstance from "../loaders/logger";
import { Inject } from "typedi";
import argon2 from "argon2";
import { UnauthorizedError } from "type-graphql";
import { Response } from "express";
import { Context } from "../loaders/configureGraphqlServer";
import { CurrentUser } from "../decorators/auth";

// FIXME:
let mockPasswordHash: string;

argon2
  .hash("This shouldn't match any thing", {
    memoryCost: config.hasingMemoryCost,
    timeCost: config.hasingTimeCost
  })
  .then(hash => {
    mockPasswordHash = hash;
  });

async function createSession(
  sessionRepository: Repository<Session>,
  user: User,
  rememberMe: boolean = false
): Promise<[Session, string]> {
  const id = crypto.randomBytes(32).toString("hex");
  const hashedId = Session.hashSessionId(id);

  const expires = new Date();

  expires.setDate(
    new Date().getDate() +
      (rememberMe
        ? config.rememberMeSessionLifetimeDays
        : config.sessionLifetimeDays)
  );

  const session = sessionRepository.create({ id: hashedId, user, expires });

  await sessionRepository.insert(session);

  return [session, id];
}

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
    @Inject("logger") private logger: typeof LoggerInstance
  ) {}

  @Mutation(returns => LoginResult)
  async signUp(@Arg("user") userInput: UserInfo, @Ctx() { res }: Context) {
    this.logger.silly(`Creating a new user: ${userInput.email}`);

    const hashedPassword = await argon2.hash(userInput.password, {
      memoryCost: config.hasingMemoryCost,
      timeCost: config.hasingTimeCost
    });

    const user = this.userRepository.create({
      ...userInput,
      admin: true,
      password: hashedPassword
    });

    try {
      await this.userRepository.insert(user);
    } catch (err) {
      // TODO:
      throw err;
    }

    const [session, sessionId] = await createSession(
      this.sessionRepository,
      user,
      true
    );
    saveSession(res, session, sessionId, true);

    this.logger.silly(`Created a new user: ${userInput.email}`, { user });

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
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      // This is here to prevent an attacker from getting a list of user's
      // emails by comparing time differences.
      // https://www.owasp.org/index.php/Testing_for_User_Enumeration_and_Guessable_User_Account_(OWASP-AT-002)
      await argon2.verify(mockPasswordHash, password);
      throw new UnauthorizedError();
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      throw new UnauthorizedError();
    }

    const [session, sessionId] = await createSession(
      this.sessionRepository,
      user,
      true
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
    await this.sessionRepository.delete({ id: sessionId });

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
