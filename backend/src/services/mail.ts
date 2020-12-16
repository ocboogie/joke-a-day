import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { Mailgun } from "mailgun-js";

export interface Message {
  subject: string;
  text: string;
}

@Service()
export default class MailService {
  constructor(
    @Inject("logger") private logger: Logger,
    @Inject("mailgun") private mailgun: Mailgun
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
