<template>
  <el-container>
    <el-header>
      <Navbar />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
<script>
import Navbar from "./components/Navbar.vue";
import { store, mutations } from "./store";

export default {
  components: {
    Navbar
  },
  computed: {
    authenticationError() {
      return store.authenticationError;
    },
    internalServerErrors() {
      return store.internalServerErrors;
    }
  },
  watch: {
    authenticationError(message) {
      if (!message) {
        return;
      }
      this.$notify({
        title: "Authentification error",
        type: "warning",
        message
      });
      this.$router.replace({ name: "login" });
      mutations.clearAuthenticationError();
    },
    internalServerErrors(errors) {
      if (errors.length === 0) {
        return;
      }
      this.$notify({
        title: "Interal Server Error",
        type: "error",
        dangerouslyUseHTMLString: true,
        message: `Please try again. If this problem persists, contact support with the following id number${
          errors.length === 1 ? "" : "s"
        }: ${errors.map(err => `<code>${err.extensions.id}</code>`).join(", ")}`
      });
      mutations.clearInternalServerErrors();
    }
  }
};
</script>
<style lang="scss">
body,
html {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  padding: 0;
  margin: 0;
}
html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
</style>
