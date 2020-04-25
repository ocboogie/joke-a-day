<template>
  <div class="login">
    <LoginCard class="login-card" />
  </div>
</template>
<script>
import LoginCard from "../components/LoginCard.vue";

export default {
  components: {
    LoginCard,
  },
};
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-card {
    min-width: 300px;
  }
}
</style>
