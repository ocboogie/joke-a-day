import { onError } from "@apollo/client/link/error";
import { mutations } from "../../store";

/**
 * This link will notify the user of an internal server error
 */
export default onError(({ graphQLErrors }) => {
  if (!graphQLErrors) {
    return;
  }
  const internalServerErrors = graphQLErrors.filter(
    (err) => err.extensions.code === "INTERNAL_SERVER_ERROR"
  );

  if (internalServerErrors.length !== 0) {
    mutations.setInternalServerErrors(internalServerErrors);
  }
});
