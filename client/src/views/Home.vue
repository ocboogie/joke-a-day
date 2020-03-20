<template>
  <div class="home">
    <template v-if="$apollo.queries.currentPromptId.loading">
      Loading...
    </template>
    <template v-else-if="currentPromptId">
      <prompt active v-if="currentPromptId" :id="currentPromptId" />
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
  data: () => ({ currentPromptId: null }),
  apollo: {
    currentPromptId: {
      query: gql`
        query {
          currentPrompt {
            id
          }
        }
      `,
      update: data => (data.currentPrompt ? data.currentPrompt.id : null)
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  text-align: center;
}
</style>
