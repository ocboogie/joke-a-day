import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import httpLink from "./links/httpLink";
import wsLink from "./links/wsLink";
import logoutLink from "./links/logoutLink";
import internalServerErrorCatcherLink from "./links/internalServerErrorCatcherLink";

const connectionLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const link = logoutLink
  .concat(internalServerErrorCatcherLink)
  .concat(connectionLink);

export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true
});
