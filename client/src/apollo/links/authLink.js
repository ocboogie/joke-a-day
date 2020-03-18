import { onError } from "apollo-link-error";
import { mutations } from "../../store";

export default onError(({ graphQLErrors }) => {
  if (graphQLErrors?.some(err => err.extensions.code == "UNAUTHENTICATED")) {
    mutations.setAuthenticationError("Session expired");
    mutations.loggedOut();
  }
});
