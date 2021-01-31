<template>
  <el-card class="login-card">
    <template slot="header">Login</template>
    <form @submit.prevent="submit">
      <el-input
        class="form-input"
        v-model="email"
        type="text"
        placeholder="Email"
        autocomplete="username"
      />
      <el-input
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
      <el-button class="form-input" type="primary" native-type="submit">
        Login
      </el-button>
    </form>
  </el-card>
</template>
<script>
import { mutations } from "../store";
import gql from "graphql-tag";

export default {
  data: () => ({ email: "", password: "", error: null }),
  methods: {
    async submit() {
      try {
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
      } catch (err) {
        this.error = err;
      }
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
