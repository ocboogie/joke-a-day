<template>
  <div class="home">
    <template v-if="$apollo.queries.currentPromptId.loading">
      Loading...
    </template>
    <template v-else-if="currentPromptId">
      <prompt v-if="currentPromptId" :id="currentPromptId" />
      <!-- TODO: Move to its own component and stylize it -->
      <modal name="create-post" class="create-post">
        <h1 class="header">Create Post</h1>

        <form @submit.prevent="createPost">
          <base-input v-model="postContent" class="content-input" />
          <base-button native-type="submit" class="post-button"
            >Post</base-button
          >
        </form>
      </modal>
      <button @click="$modal.show('create-post')">
        Create post
      </button>
    </template>
    <template v-else>
      No prompt today. Please email boogie@mikulec.com
    </template>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Prompt from "../components/Prompt.vue";

export default {
  name: "home",
  components: {
    Prompt
  },
  data: () => ({ currentPromptId: null, postContent: "" }),
  methods: {
    createPost() {
      this.$apollo.mutate({
        mutation: gql`
          mutation($postContent: String!, $promptId: String!) {
            createPost(content: $postContent, promptId: $promptId) {
              id
            }
          }
        `,
        variables: {
          postContent: this.postContent,
          promptId: this.currentPromptId
        }
      });
    }
  },

  apollo: {
    currentPromptId: {
      query: gql`
        query {
          currentPrompt {
            id
          }
        }
      `,
      update: data => data.currentPrompt.id
    }
  }
};
</script>
<style lang="scss" scoped>
.create-post {
  .header {
    text-align: center;
  }
}
</style>
