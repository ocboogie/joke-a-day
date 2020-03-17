import {
  EntityRepository,
  Repository,
  FindOneOptions,
  LessThanOrEqual
} from "typeorm";
import Prompt from "../models/Prompt";

@EntityRepository(Prompt)
export default class PromptRepository extends Repository<Prompt> {
  /**
   * Finds the current prompt (the prompt that's scheduled for the current time)
   * @param options these are the options passed to `repo.find`
   */
  findCurrent(options?: FindOneOptions<Prompt>) {
    const now = Prompt.ScheduleDateFormat(new Date());

    return this.findOne({
      ...options,
      where: { scheduled: now }
    });
  }

  /**
   * Returns all prompts that aren't in the futrue
   * @param options these are the options passed to `repo.find`
   */
  allActive(options?: FindOneOptions<Prompt>) {
    const now = Prompt.ScheduleDateFormat(new Date());

    return this.find({
      ...options,
      where: { scheduled: LessThanOrEqual(now) }
    });
  }

  /**
   * Find an active prompt by id. Active meaning not in the future
   * @param id id of prompt
   * @param options these are the options passed to `repo.find`
   */
  findActiveById(id: string, options?: FindOneOptions<Prompt>) {
    const now = Prompt.ScheduleDateFormat(new Date());

    return this.findOne({
      ...options,
      where: { id, scheduled: LessThanOrEqual(now) }
    });
  }
}
