<template>
  <div class="home">
    <posts :posts="posts" />
  </div>
</template>

<script>
import gql from "graphql-tag";
import Posts from "../components/Posts.vue";

export default {
  name: "home",
  components: {
    Posts
  },
  data: () => ({ posts: [] }),
  methods: {},

  apollo: {
    posts: {
      query: gql`
        query {
          currentPrompt {
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
      update: data => data.currentPrompt.posts
    }
  }
};
</script>
