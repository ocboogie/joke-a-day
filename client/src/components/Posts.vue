<template>
  <div class="posts">
    <transition-group name="post-list">
      <Post v-for="post in posts" :key="post.id" v-bind="post" />
    </transition-group>
  </div>
</template>
<script>
import Post from "./Post.vue";

export default {
  components: {
    Post
  },
  props: {
    posts: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
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
