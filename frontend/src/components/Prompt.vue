<template>
  <div class="prompt" v-if="prompt">
    <InfoDisplay :prompt="prompt.content" />
    <el-button
      v-if="active"
      type="primary"
      class="create-post"
      @click.native="openPostCreation"
    >
      Create post
    </el-button>
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
      })
        .then(({ value }) => {
          this.createPost(value);
        })
        .catch(() => {});
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
            return {
              prompt: {
                posts: subscriptionData.data.postAdded,
              },
            };
          },
        },
        {
          document: gql`
            subscription($promptId: String!) {
              postDeleted(promptId: $promptId)
            }
          `,
          variables() {
            return {
              promptId: this.id,
            };
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            return {
              prompt: {
                posts: previousResult.prompt.posts.filter(
                  (post) => post.id !== subscriptionData.data.postDeleted
                ),
              },
            };
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
