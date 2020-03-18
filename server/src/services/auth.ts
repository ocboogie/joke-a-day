import crypto from "crypto";
import { Service, Inject } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import argon2 from "argon2";
import Session from "../models/Session";
import User from "../models/User";
import LoggerInstance from "../loaders/logger";
import config from "../config";
import { UserInfo, UserLogin } from "../types/user";

@Service("auth.service")
export default class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @Inject("logger") private logger: typeof LoggerInstance
  ) {}

  /**
   * This will do all the things necessary to create a session and returns the
   * session object and the unhashed id
   *
   * @param user the user that we're creating the session for
   * @param rememberMe weather to remember the user for a long time
   *
   * @returns session object and unhashed session id
   */
  async createSession(user: User, rememberMe: boolean = false) {
    const id = crypto.randomBytes(32).toString("hex");
    const hashedId = Session.hashSessionId(id);

    const expires = new Date(
      Date.now() +
        (rememberMe ? config.rememberMeSessionLifetime : config.sessionLifetime)
    );

    const session = this.sessionRepository.create({
      id: hashedId,
      user,
      expires
    });

    await this.sessionRepository.insert(session);

    return { session, sessionId: id };
  }

  /**
   * Creates a new user and creates a new session for that user
   *
   * @param userInput all the info necessary to create the user
   *
   * @returns the user object, the session object and the unhashed session id
   */
  async signUp(userInput: UserInfo) {
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

    const { session, sessionId } = await this.createSession(user, true);

    this.logger.silly(`Created a new user: ${userInput.email}`, { user });

    return {
      user,
      session,
      sessionId
    };
  }

  /**
   * Verifies credentials and creates a session if successful
   *
   * @param email email of the user
   * @param password password in plain text
   * @param rememberMe weather to remember the user for a long time
   *
   * @returns the user object, the session object and the unhashed session id
   */
  async login(email: string, password: string, rememberMe: boolean = false) {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      // This is here to prevent an attacker from getting a list of user's
      // emails by comparing time differences.
      // https://www.owasp.org/index.php/Testing_for_User_Enumeration_and_Guessable_User_Account_(OWASP-AT-002)
      await argon2.hash(password, {
        memoryCost: config.hasingMemoryCost,
        timeCost: config.hasingTimeCost
      });
      // FIXME: Use better errors
      throw "User not found";
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      // FIXME: Don't use graphql errors in services
      throw "Invalid password";
    }

    const { session, sessionId } = await this.createSession(user, rememberMe);

    return {
      user,
      session,
      sessionId
    };
  }

  /**
   * Delete the session from the database, making the session unusable
   *
   * @param sessionId the unhashed id of the session to logout from
   */
  logout(sessionId: string) {
    const hashedId = Session.hashSessionId(sessionId);

    return this.sessionRepository.delete({ id: hashedId });
  }
}
