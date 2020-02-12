<template>
  <button
    :class="[
      { loading, 'flush-left': flushLeft, 'flush-right': flushRight },
      `button-type-${type}`
    ]"
    :disabled="loading"
    :type="nativeType"
    class="base-button"
  >
    <slot v-if="loading" name="loading" /> <slot v-else />
  </button>
</template>

<script>
// TODO: https://youtu.be/7YZ5DwlLSt8?t=1675
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "primary"
    },
    nativeType: {
      type: String,
      default: "button"
    },
    flushLeft: { type: Boolean, default: false },
    flushRight: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss" scoped>
.base-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  text-align: center;
  outline: none;
  transition: 0.1s;
  font-weight: 500;
  user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  &.flush-right {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &.flush-left {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &.loading {
    min-width: 100px;
    & > * {
      margin: auto;
    }
  }
  &.button-type-primary {
    border: 1px solid $primary-color;
    background-color: $primary-color;
    color: $white;
    &:disabled {
      cursor: default;
      background: mix($white, $primary-color, 50%);
      border: 1px solid mix($white, $primary-color, 50%);
    }
    &:not(:disabled) {
      &:hover,
      &:focus {
        background: lighten($primary-color, 7%);
        border-color: lighten($primary-color, 9%);
      }
      &:active {
        background: darken($primary-color, 10%);
        border-color: darken($primary-color, 10%);
      }
    }
  }
  &.button-type-info {
    border: 1px solid $info-color;
    background-color: $info-color;
    color: $white;
    &:disabled {
      cursor: default;
      background: mix($white, $info-color, 50%);
      border: 1px solid mix($white, $info-color, 50%);
    }
    &:not(:disabled) {
      &:hover,
      &:focus {
        background: lighten($info-color, 7%);
        border-color: lighten($info-color, 9%);
      }
      &:active {
        background: darken($info-color, 10%);
        border-color: darken($info-color, 10%);
      }
    }
  }
}
</style>
