<template>
  <BaseCard class="login-card">
    <h1 class="header">Login</h1>
    <form @submit.prevent="submit">
      <BaseInput
        class="form-input"
        v-model="email"
        type="text"
        placeholder="Email"
        autocomplete="username"
      />
      <BaseInput
        class="form-input"
        v-model="password"
        type="password"
        placeholder="Password"
        autocomplete="current-password"
      />
      <BaseButton class="form-input" native-type="submit">
        Login
      </BaseButton>
    </form>
  </BaseCard>
</template>
<script>
import gql from "graphql-tag";

export default {
  data: () => ({ email: "", password: "" }),
  methods: {
    submit() {
      this.$apollo.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!) {
            login(user: { email: $email, password: $password }) {
              id
            }
          }
        `,
        variables: {
          email: this.email,
          password: this.password
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.login-card {
  .header {
    font-weight: 300;
    margin-top: 0;
    margin-bottom: 0.75rem;
  }
  .form-input {
    width: 100%;
    margin-bottom: 0.5rem;
    display: block;
  }
}
</style>
