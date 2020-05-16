<template>
  <BaseCard class="login-card">
    <template slot="header">Login</template>
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
import { mutations } from "../store";
import gql from "graphql-tag";

export default {
  data: () => ({ email: "", password: "" }),
  methods: {
    async submit() {
      // TODO: Handle errors
      const {
        data: {
          login: {
            user: { id, admin },
          },
        },
      } = await this.$apollo.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!) {
            login(user: { email: $email, password: $password }) {
              user {
                id
                admin
              }
            }
          }
        `,
        variables: {
          email: this.email,
          password: this.password,
        },
      });
      // TODO: Factor out the similar logic in SignupCard
      mutations.loggedIn(id, admin);
      this.$router.replace({ name: "home" });
    },
  },
};
</script>
<style lang="scss" scoped>
.form-input {
  width: 100%;
  margin-bottom: 0.5rem;
  display: block;
}
</style>
