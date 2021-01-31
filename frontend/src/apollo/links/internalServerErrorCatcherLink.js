import { onError } from "@apollo/client/link/error";
import { mutations } from "../../store";

/**
 * This link will notify the user of an internal server error
 */
export default onError(({ graphQLErrors, response }) => {
  if (!graphQLErrors) {
    return;
  }

  const internalServerErrors = [];
  response.errors = graphQLErrors.filter((err) => {
    if (err.extensions.code === "INTERNAL_SERVER_ERROR") {
      internalServerErrors.push(err);
      return false;
    } else {
      return true;
    }
  });

  if (internalServerErrors.length !== 0) {
    mutations.setInternalServerErrors(internalServerErrors);
  }
});
