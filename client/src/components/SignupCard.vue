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
      <transition name="scale-fade">
        <div v-if="Boolean(error)" class="error">
          <template v-for="(error, i) of error.graphQLErrors">
            {{ error.message }} <br :key="i" />
          </template>
        </div>
      </transition>
      <BaseButton class="form-input" native-type="submit">
        Sign Up
      </BaseButton>
    </form>
  </BaseCard>
</template>
<script>
// TODO: Factor out the similarities with LoginCard
import gql from "graphql-tag";
import { mutations } from "../store";

export default {
  data: () => ({ username: "", email: "", password: "", error: null }),
  methods: {
    async submit() {
      // TODO: Handle errors
      try {
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
        mutations.loggedIn(id);
        this.$router.replace({ name: "home" });
      } catch (err) {
        this.error = err;
      }
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
.error {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: $error-color;
}
.scale-fade-enter-active {
  transition: font-size 0.2s ease, opacity 0.1s ease-out 0.15s, margin 0.2s ease;
}
.scale-fade-leave-active {
  transition: opacity 0.1s ease, font-size 0.2s ease-out 0.05s,
    margin 0.2s ease-out 0.05s;
}
.scale-fade-enter,
.scale-fade-leave-to {
  margin: 0;
  opacity: 0;
  font-size: 0rem;
}
</style>
