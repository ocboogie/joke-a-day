import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import apolloProvider from "./plugins/vue-apollo";
import "./plugins/fortawesome";
import "./plugins/element";
import "./components/_globals";

Vue.config.productionTip = false;

new Vue({
  data: {
    meId: localStorage.getItem("meId"),
  },
  router,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
