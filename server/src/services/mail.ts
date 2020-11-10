import { Service, Inject } from "typedi";
import MailgunInstance from "../loaders/mailgun";
import LoggerInstance from "../loaders/logger";

export interface Message {
  subject: string;
  text: string;
}

@Service()
export default class MailService {
  constructor(
    @Inject("logger") private logger: typeof LoggerInstance,
    @Inject("mailgun") private mailgun: typeof MailgunInstance
  ) {}

  public static messages: { [name: string]: Message } = {
    win: {
      subject: "You've won!",
      text: "You've won a prompt.",
    },
  };

  public async sendEmail(message: Message, to: string) {
    this.logger.silly(
      `Sent email with subject "${message.subject}" to "${to}"`
    );
    // TODO: Handle errors
    return this.mailgun.messages().send({
      // FIXME: Put this in the config
      from: "Test 123 <hello@world.com>",
      to: to,
      subject: message.subject,
      text: message.text,
    });
  }
}
