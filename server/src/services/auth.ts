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

export class AuthenticationError extends Error {
  constructor(public email: string, message?: string) {
    super(message || `Authentication error with user: ${email}`);
    this.name = "AuthenticationError";
  }
}

export class EmailInUseError extends AuthenticationError {
  constructor(public email: string) {
    super(email, "Email already in use");
    this.name = "EmailInUse";
  }
}

export class InvalidCredentials extends AuthenticationError {
  constructor(public email: string, message?: string) {
    super(email, message || "Invalid credentials");
    this.name = "InvalidCredentials";
  }
}

/**
 * This is not a user facing error. Use InvalidCredentials instead.
 */
export class InvalidEmailError extends InvalidCredentials {
  constructor(public email: string) {
    super(email, "No user with that email");
    this.name = "InvalidEmail";
  }
}

/**
 * This is not a user facing error. Use InvalidCredentials instead.
 */
export class IncorrectPasswordError extends InvalidCredentials {
  constructor(public email: string) {
    super(email, "User found but the password was incorrect");
    this.name = "IncorrectPassword";
  }
}

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

    if (await this.userRepository.findOne({ email: userInput.email })) {
      this.logger.silly(`Email already in use: ${userInput.email}`);
      throw new EmailInUseError(userInput.email);
    }

    const hashedPassword = await argon2.hash(userInput.password, {
      memoryCost: config.hasingMemoryCost,
      timeCost: config.hasingTimeCost
    });

    const user = this.userRepository.create({
      ...userInput,
      admin: true,
      password: hashedPassword
    });

    await this.userRepository.insert(user);

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
    this.logger.silly(`User logging in: ${email}`);
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      // This is here to prevent an attacker from getting a list of user's
      // emails by comparing time differences.
      // https://www.owasp.org/index.php/Testing_for_User_Enumeration_and_Guessable_User_Account_(OWASP-AT-002)
      await argon2.hash(password, {
        memoryCost: config.hasingMemoryCost,
        timeCost: config.hasingTimeCost
      });
      this.logger.silly(`No user with email: ${email}`);
      throw new InvalidEmailError(email);
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      this.logger.silly(`Incorrect password: ${email}`);
      throw new IncorrectPasswordError(email);
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
