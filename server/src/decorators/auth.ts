import {
  createParamDecorator,
  UnauthorizedError,
  createMethodDecorator
} from "type-graphql";
import { Context } from "../loaders/configureGraphqlServer";
import { getRepository } from "typeorm";
import Session from "../models/Session";
import User from "../models/User";

async function getUserFromContext(context: Context) {
  if (context.user) {
    return context.user;
  }

  const { sessionId } = context.req.cookies;

  if (!sessionId) {
    return;
  }

  const sessionRepository = getRepository(Session);
  const session = await sessionRepository.findOne(
    { id: sessionId },
    { relations: ["user"] }
  );

  if (!session || !(await session.vaild(sessionRepository))) {
    return;
  }

  const user = await session.user;

  context.user = user;

  return user;
}

export function Admin() {
  return createMethodDecorator<Context>(async ({ context }, next) => {
    const user = await getUserFromContext(context);

    if (!user?.admin) {
      throw new UnauthorizedError();
    }

    return next();
  });
}
export function CurrentUser(required: boolean = true) {
  return createParamDecorator<Context>(async ({ context }) => {
    const user = await getUserFromContext(context);

    if (!user && required) {
      throw new UnauthorizedError();
    }

    return user;
  });
}
