import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import apolloProvider from "./plugins/vue-apollo";
import "./plugins/fortawesome";
import "./plugins/vue-js-modal";
import "./components/_globals";

Vue.config.productionTip = false;

new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
