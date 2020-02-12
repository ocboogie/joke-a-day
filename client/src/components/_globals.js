import Vue from "vue";

const requireComponent = require.context("./", false, /Base[\w-]+\.vue$/);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);

  const componetName = fileName.replace(/\.\//, "").replace(/\.\w+$/, "");

  Vue.component(componetName, componentConfig.default || componentConfig);
});
