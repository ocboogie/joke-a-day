import { getRepository } from "typeorm";
import User from "../models/User";

export default async () => {
  const userRepo = getRepository(User);

  await userRepo.save({
    email: "joe@test.com",
    name: "joe",
    admin: false,
    // "password" hashed
    password:
      "$argon2i$v=19$m=4096,t=3,p=1$wNOq27hBFV46rwA7qiESZw$hjiLkbhcxGcZzr3Oh9sWPoNnPhg/DHdHiy0OQNL2/JE",
  });
};
