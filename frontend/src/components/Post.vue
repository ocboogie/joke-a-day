<template>
  <BaseCard paddingless class="post">
    <div class="upvotes">
      <button
        :class="{ 'is-selected': userVote > 0 }"
        class="arrow upvote"
        @click="upvote"
        v-if="active"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 15">
          <path
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="5"
            d="m2.5 12.5l10-10 10 10"
          />
        </svg>
      </button>
      {{ upvotes }}
      <button
        :class="{ 'is-selected': userVote < 0 }"
        class="arrow downvote"
        @click="downvote"
        v-if="active"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 15">
          <path
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="5"
            d="m2.5 2.5l10 10 10-10"
          />
        </svg>
      </button>
    </div>
    <div class="body">
      <div class="post-content">{{ content }}</div>
      <div class="author">
        By
        <!-- TODO: Stylize this  -->
        <router-link :to="{ name: 'user', params: { userId: author.id } }">
          {{ author.name }}
        </router-link>
      </div>
      <button
        v-if="deletable"
        type="button"
        class="delete-button"
        @click="deletePost"
      >
        X
      </button>
    </div>
  </BaseCard>
</template>
<script>
import gql from "graphql-tag";
import { store } from "../store";
import { MessageBox } from "element-ui";

export default {
  props: {
    upvotes: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    userVote: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    deletable() {
      return store.isAdmin || store.meId == this.author.id;
    },
  },
  methods: {
    deletePost() {
      MessageBox.confirm(
        "This post will be permanently deleted and is undoable.",
        "Delete post?",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          this.$apollo.mutate({
            mutation: gql`
              mutation($postId: String!) {
                deletePost(postId: $postId)
              }
            `,
            variables: {
              postId: this.id,
            },
          });
        })
        .catch(() => {});
    },
    upvote() {
      if (this.userVote > 0) {
        this.unvote();
        return;
      }
      this.$apollo.mutate({
        mutation: gql`
          mutation($postId: String!) {
            upvote(postId: $postId) {
              id
            }
          }
        `,
        variables: {
          postId: this.id,
        },
      });
    },
    downvote() {
      if (this.userVote < 0) {
        this.unvote();
        return;
      }
      this.$apollo.mutate({
        mutation: gql`
          mutation($postId: String!) {
            downvote(postId: $postId) {
              id
            }
          }
        `,
        variables: {
          postId: this.id,
        },
      });
    },
    unvote() {
      this.$apollo.mutate({
        mutation: gql`
          mutation($postId: String!) {
            unvote(postId: $postId) {
              id
            }
          }
        `,
        variables: {
          postId: this.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$arrowCircleSize: 31.25px;

.post {
  text-align: left;
  margin: 2rem 0;
  min-height: 85px;
  display: flex;
  flex-direction: row;
  .upvotes {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-width: 40px;
    .arrow {
      position: absolute;
      border-radius: 50%;
      border: none;
      background-color: $white;
      width: $arrowCircleSize;
      height: $arrowCircleSize;
      transition: color 0.1s ease;
      outline: none;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.09);
      stroke: #3d3d3d;
      padding: 3px;
      cursor: pointer;
      & > svg {
        display: block;
        margin: auto;
      }
      &:focus {
        background-color: darken($white, 7.5%);
      }
      &.upvote {
        top: -$arrowCircleSize / 5 * 2;
        &.is-selected {
          stroke: $primary-color;
        }
        &:hover {
          stroke: lighten($primary-color, 10%);
        }
        &:active {
          stroke: darken($primary-color, 10%);
        }
      }
      &.downvote {
        bottom: -$arrowCircleSize / 5 * 2;
        &.is-selected {
          stroke: $error-color;
        }
        &:hover {
          stroke: lighten($error-color, 5%);
        }
        &:active {
          stroke: darken($error-color, 10%);
        }
      }
    }
  }
  .body {
    border-left: 1px solid $border-lighter-color;
    padding: 10px;
    word-break: break-word;
    flex-grow: 1;
    position: relative;
    .delete-button {
      position: absolute;
      top: 5px;
      right: 7.5px;
      padding: 0;
      border: none;
      outline: 0;
      background: 0 0;
      cursor: pointer;
      font-size: 14px;
      color: $text-muted;
    }
  }
  .author {
    font-size: 14px;
    font-weight: 300;
  }
}
</style>
