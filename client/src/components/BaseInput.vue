<template>
  <textarea
    v-if="multiline"
    :value="value"
    rows="3"
    class="base-input is-multiline"
    @input="$emit('input', $event.target.value)"
  />
  <input
    v-else
    :value="value"
    class="base-input"
    :class="{ 'flush-left': flushLeft, 'flush-right': flushRight }"
    @input="$emit('input', $event.target.value)"
  />
</template>
<script>
export default {
  props: {
    value: { type: [String, Number], default: "" },
    multiline: { type: Boolean, default: false },
    flushLeft: { type: Boolean, default: false },
    flushRight: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss" scoped>
.base-input {
  border-radius: 4px;
  border: 1px solid $border-base-color;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  height: 40px;
  padding: 12px 15px;
  &.flush-right {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &.flush-left {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &.is-multiline {
    height: auto;
    display: block;
    resize: vertical;
    padding: 8px 12px;
    width: 100%;
    min-height: 2rem;
  }
  &::placeholder {
    color: $text-placeholder-color;
  }
  &:hover {
    border-color: $text-placeholder-color;
  }
  &:focus {
    outline: none;
    border-color: $primary-color;
  }
  &.is-error {
    border-color: $error-color;
  }
}
</style>
