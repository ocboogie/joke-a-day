<template>
  <div class="prompt" v-if="prompt">
    <InfoDisplay :prompt="prompt.content" />
    <Divider />
    <!-- <post-form full-width class="post-form" /> -->
    <Posts :promptId="id" :posts="prompt.posts" />
  </div>
</template>
<script>
import gql from "graphql-tag";
import Posts from "./Posts.vue";
import Divider from "./Divider.vue";
import InfoDisplay from "./InfoDisplay.vue";

export default {
  components: {
    Posts,
    Divider,
    InfoDisplay
  },
  props: {
    id: {
      type: String,
      requried: true
    }
  },
  data: () => ({ prompt: null }),
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
                }
                upvotes
                userVote
              }
            }
          `,
          variables() {
            return {
              promptId: this.id
            };
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            const postUpdated = subscriptionData.data.postUpdated;
            const updatedPost = previousResult.prompt.posts.find(
              post => postUpdated.id == post.id
            );
            Object.assign(updatedPost, postUpdated);

            return previousResult;
          }
        },
        {
          document: gql`
            subscription($promptId: String!) {
              postAdded(promptId: $promptId) {
                id
                content
                author {
                  name
                }
                upvotes
                userVote
              }
            }
          `,
          variables() {
            return {
              promptId: this.id
            };
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            previousResult.prompt.posts.push(subscriptionData.data.postAdded);

            return previousResult;
          }
        }
      ]
    }
  }
};
</script>
