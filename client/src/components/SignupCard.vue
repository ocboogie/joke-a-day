<template>
  <BaseCard class="signup-card">
    <h1 class="header">SignUp</h1>
    <form @submit.prevent="submit">
      <BaseInput
        class="form-input"
        v-model="username"
        type="text"
        placeholder="Username"
        autocomplete="username"
      />
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
        Signup
      </BaseButton>
    </form>
  </BaseCard>
</template>
<script>
import gql from "graphql-tag";

export default {
  data: () => ({ username: "", email: "", password: "" }),
  methods: {
    submit() {
      this.$apollo.mutate({
        mutation: gql`
          mutation($username: String!, $email: String!, $password: String!) {
            signUp(
              user: { name: $username, email: $email, password: $password }
            ) {
              id
            }
          }
        `,
        variables: {
          username: this.username,
          email: this.email,
          password: this.password
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.signup-card {
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
