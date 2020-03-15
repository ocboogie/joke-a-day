import { EntityRepository, Repository, FindOneOptions } from "typeorm";
import Prompt from "../models/Prompt";

@EntityRepository(Prompt)
export default class PromptRepository extends Repository<Prompt> {
  findCurrent(options?: FindOneOptions<Prompt>) {
    const now = Prompt.ScheduleDateFormat(new Date());

    return this.findOne({
      ...options,
      where: { scheduled: now }
    });
  }
}
