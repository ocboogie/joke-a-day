import createAdmin from "../seeds/createAdmin";
import createUser from "../seeds/createUser";
import createPrompt from "../seeds/createPrompt";
import createOldPrompt from "../seeds/createOldPrompt";

export default async () => {
  await createAdmin();
  await createUser();
  await createPrompt();
  await createOldPrompt();
};
