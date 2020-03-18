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
