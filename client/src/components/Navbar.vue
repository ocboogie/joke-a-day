<template>
  <el-menu default-active="/" class="navbar" mode="horizontal" router>
    <el-menu-item index="/">Home</el-menu-item>
    <template v-if="loggedIn">
      <el-submenu class="right" index="2-4">
        <template slot="title"><i class="el-icon-user-solid"/></template>
        <el-menu-item index="/profile">Profile</el-menu-item>
        <el-menu-item @click="logout">Logout</el-menu-item>
      </el-submenu>
    </template>
    <template v-else>
      <el-menu-item class="right" index="/signUp">Sign up</el-menu-item>
      <el-menu-item class="right" index="/login">Login</el-menu-item>
    </template>
  </el-menu>
</template>
<script>
import gql from "graphql-tag";
import { mutations, getters } from "../store";

export default {
  computed: {
    loggedIn() {
      return getters.loggedIn();
    }
  },
  methods: {
    async logout() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation {
            logout
          }
        `
      });
      mutations.loggedOut();
      this.$router.replace({ name: "home" });
    }
  }
};
</script>
<style lang="scss" scoped>
.navbar .right {
  float: right;
}
</style>
