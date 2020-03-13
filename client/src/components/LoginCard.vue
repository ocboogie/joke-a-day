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
import gql from "graphql-tag";

export default {
  data: () => ({ email: "", password: "" }),
  methods: {
    async submit() {
      // TODO: Handle errors
      const {
        data: {
          login: {
            user: { id }
          }
        }
      } = await this.$apollo.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!) {
            login(user: { email: $email, password: $password }) {
              user {
                id
              }
            }
          }
        `,
        variables: {
          email: this.email,
          password: this.password
        }
      });
      console.log(id);
      // TODO: Factor out the similar logic in SignupCard
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
