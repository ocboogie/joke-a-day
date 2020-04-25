<template>
  <div class="prompt" v-if="prompt">
    <InfoDisplay :prompt="prompt.content" />
    <base-button
      v-if="active"
      class="create-post"
      @click.native="openPostCreation"
    >
      Create post
    </base-button>
    <el-divider><div class="circle-in-divider" /></el-divider>
    <Posts :active="active" :promptId="id" :posts="prompt.posts" />
  </div>
</template>
<script>
import gql from "graphql-tag";
import Posts from "./Posts.vue";
import InfoDisplay from "./InfoDisplay.vue";

export default {
  components: {
    Posts,
    InfoDisplay,
  },
  props: {
    id: {
      type: String,
      requried: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({ prompt: null }),
  methods: {
    openPostCreation() {
      this.$prompt("What do you want to say?", {
        confirmButtonText: "Post",
        cancelButtonText: "Cancel",
        inputErrorMessage: "Invalid post",
      }).then(({ value }) => {
        this.createPost(value);
      });
    },
    createPost(postContent) {
      this.$apollo.mutate({
        mutation: gql`
          mutation($postContent: String!, $promptId: String!) {
            createPost(content: $postContent, promptId: $promptId) {
              id
            }
          }
        `,
        variables: {
          postContent,
          promptId: this.id,
        },
      });
    },
  },
  apollo: {
    prompt: {
      query: gql`
        query($id: String!) {
          prompt(id: $id) {
            id
            content
            posts {
              id
              content
              author {
                name
                id
              }
              upvotes
              userVote
            }
          }
        }
      `,
      variables() {
        return { id: this.id };
      },
      subscribeToMore: [
        {
          document: gql`
            subscription($promptId: String!) {
              postUpdated(promptId: $promptId) {
                id
                content
                author {
                  name
                  id
                }
                upvotes
                userVote
              }
            }
          `,
          variables() {
            return {
              promptId: this.id,
            };
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            const postUpdated = subscriptionData.data.postUpdated;
            const updatedPost = previousResult.prompt.posts.find(
              (post) => postUpdated.id == post.id
            );
            Object.assign(updatedPost, postUpdated);

            return previousResult;
          },
        },
        {
          document: gql`
            subscription($promptId: String!) {
              postAdded(promptId: $promptId) {
                id
                content
                author {
                  name
                  id
                }
                upvotes
                userVote
              }
            }
          `,
          variables() {
            return {
              promptId: this.id,
            };
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            previousResult.prompt.posts.push(subscriptionData.data.postAdded);

            return previousResult;
          },
        },
      ],
    },
  },
};
</script>
<style lang="scss" scoped>
.prompt {
  .create-post {
    display: block;
    margin-left: auto;
  }
  .circle-in-divider {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: $border-lighter-color;
  }
}
</style>
