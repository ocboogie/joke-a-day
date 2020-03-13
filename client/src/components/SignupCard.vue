<template>
  <BaseCard class="signup-card">
    <template slot="header">Sign Up</template>
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
        Sign Up
      </BaseButton>
    </form>
  </BaseCard>
</template>
<script>
import gql from "graphql-tag";

export default {
  data: () => ({ username: "", email: "", password: "" }),
  methods: {
    async submit() {
      // TODO: Handle errors
      const {
        data: {
          signUp: {
            user: { id }
          }
        }
      } = await this.$apollo.mutate({
        mutation: gql`
          mutation($username: String!, $email: String!, $password: String!) {
            signUp(
              user: { name: $username, email: $email, password: $password }
            ) {
              user {
                id
              }
            }
          }
        `,
        variables: {
          username: this.username,
          email: this.email,
          password: this.password
        }
      });
      this.$root.meId = id;
      // This dosen't need to be "true" but we need to put something there
      localStorage.setItem("meId", id);
      this.$router.replace({ name: "home" });
    }
  }
};
</script>
<style lang="scss" scoped>
.form-input {
  width: 100%;
  margin-bottom: 0.5rem;
  display: block;
}
</style>
