import createAdmin from "../seeds/createAdmin";
import createUser from "../seeds/createUser";
import createPrompt from "../seeds/createPrompt";

export default async () => {
  await createAdmin();
  await createUser();
  await createPrompt();
};
