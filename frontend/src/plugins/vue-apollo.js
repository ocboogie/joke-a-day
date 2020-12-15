import Vue from "vue";
import VueApollo from "vue-apollo";
import apolloClient from "../apollo";

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(VueApollo);

export default apolloProvider;
