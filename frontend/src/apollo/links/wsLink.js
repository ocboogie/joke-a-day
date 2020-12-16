import { WebSocketLink } from "@apollo/client/link/ws";

export default new WebSocketLink({
  uri: process.env.VUE_APP_GRAPHQL_WS,
  options: {
    reconnect: true,
  },
});