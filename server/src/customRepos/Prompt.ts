import { EntityRepository, Repository, FindOneOptions } from "typeorm";
import Prompt from "../models/Prompt";

@EntityRepository(Prompt)
export default class PromptRepository extends Repository<Prompt> {
  findCurrent(options?: FindOneOptions<Prompt>) {
    return this.findOne({
      ...options,
      where: { active: true },
      order: { scheduled: "DESC" }
    });
  }
}
