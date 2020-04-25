import { onError } from "apollo-link-error";
import { mutations } from "../../store";

/**
 * This link will log out the user if there are any requests that respond with
 * an with the extension code "UNAUTHENTICATED"
 */
export default onError(({ graphQLErrors }) => {
  if (graphQLErrors?.some((err) => err.extensions.code == "UNAUTHENTICATED")) {
    mutations.setAuthenticationError("Session expired");
    mutations.loggedOut();
  }
});
