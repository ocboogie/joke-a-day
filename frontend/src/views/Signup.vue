<template>
  <div class="signup">
    <SignupCard class="signup-card" />
  </div>
</template>
<script>
import SignupCard from "../components/SignupCard.vue";

export default {
  components: {
    SignupCard,
  },
};
</script>
<style lang="scss" scoped>
.signup {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .signup-card {
    min-width: 300px;
  }
}
</style>
