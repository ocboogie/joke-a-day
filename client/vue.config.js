module.exports = {
  pluginOptions: { apollo: { lintGQL: true } },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/variables.scss";`,
      },
    },
  },
};
