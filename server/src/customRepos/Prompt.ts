import {
  EntityRepository,
  Repository,
  FindOneOptions,
  LessThanOrEqual
} from "typeorm";
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

  allActive(options?: FindOneOptions<Prompt>) {
    const now = Prompt.ScheduleDateFormat(new Date());

    return this.find({
      ...options,
      where: { scheduled: LessThanOrEqual(now) }
    });
  }

  findActiveById(id: string, options?: FindOneOptions<Prompt>) {
    const now = Prompt.ScheduleDateFormat(new Date());

    return this.findOne({
      ...options,
      where: { id, scheduled: LessThanOrEqual(now) }
    });
  }
}
