<template>
  <div class="profile">
    <el-card class="profile-card">
      <template slot="header">Profile</template>
      <template v-if="originalMe">
        <label>
          <div class="label-text">Username</div>
          <el-input class="field-input" v-model="me.name" />
        </label>
        <el-button
          type="primary"
          :disabled="!updated"
          class="update"
          @click.native="update"
        >
          Update
        </el-button>
      </template>
    </el-card>
  </div>
</template>
<script>
import gql from "graphql-tag";
import { store } from "../store";

export default {
  computed: {
    updated() {
      return this.originalMe.name !== this.me.name;
    },
  },
  data: () => ({
    me: {},
    originalMe: null,
  }),
  methods: {
    async update() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($meId: String!, $username: String!) {
            changeUsername(userId: $meId, username: $username) {
              id
            }
          }
        `,
        variables: {
          meId: store.meId,
          username: this.me.name,
        },
      });

      this.originalMe = { ...this.me };
    },
  },
  apollo: {
    originalMe: {
      query: gql`
        {
          me {
            name
          }
        }
      `,
      update(data) {
        this.me = { ...data.me };

        return data.me;
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.profile {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .profile-card {
    min-width: 300px;
  }
  .label-text {
    display: inline-block;
    width: 100px;
  }
  .update {
    margin-top: 2rem;
    display: block;
    margin-left: auto;
  }
}
</style>
