module.exports = {
  pluginOptions: { apollo: { lintGQL: true } },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/variables.scss";`,
      },
    },
  },
};
