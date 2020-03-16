import mailgun from "mailgun-js";

if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOAMAIN_NAME) {
  throw "You must supply the MAILGUN_API_KEY and MAILGUN_DOAMAIN_NAME environment variables";
}

export default mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOAMAIN_NAME
});
