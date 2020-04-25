<template>
  <div class="profile">
    <BaseCard class="profile-card">
      <template slot="header">Profile</template>
      <template v-if="me">
        <label>
          <div class="label-text">Username</div>
          <base-input class="field-input" v-model="me.name" />
        </label>
        <base-button :disabled="!updated" class="update" @click.native="update">
          Update
        </base-button>
      </template>
    </BaseCard>
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
    me: null,
    originalMe: {},
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

      // The copy is done to make sure vue catches the change
      this.originalMe = { ...this.me };
    },
  },
  apollo: {
    me: {
      query: gql`
        {
          me {
            name
          }
        }
      `,
      update(data) {
        Object.assign(this.originalMe, data.me);

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
