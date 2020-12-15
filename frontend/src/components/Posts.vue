<template>
  <div class="posts">
    <transition-group name="post-list">
      <Post
        v-for="post in sorted"
        :key="post.id"
        :active="active"
        v-bind="post"
      />
    </transition-group>
  </div>
</template>
<script>
import Post from "./Post.vue";

export default {
  components: {
    Post,
  },
  computed: {
    sorted() {
      // This is done to prevent side effects
      const clonedPosts = this.posts.slice();

      return clonedPosts.sort((postA, postB) => postB.upvotes - postA.upvotes);
    },
  },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.posts {
  overflow: hidden;
}
.post-list-enter-active,
.post-list-leave-active {
  transition: all 0.25s ease-out;
}
.post-list-enter,
.post-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.post-list-move {
  transition: transform 0.25s;
}
</style>
