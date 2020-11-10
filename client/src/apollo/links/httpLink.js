import { HttpLink } from "@apollo/client/core";

export default new HttpLink({
  credentials: "include",
  // You should use an absolute URL here
  uri: process.env.VUE_APP_GRAPHQL_HTTP,
});
