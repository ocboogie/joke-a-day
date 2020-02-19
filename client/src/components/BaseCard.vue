<template>
  <div :class="{ paddingless }" class="card">
    <h1 v-if="$slots.header" class="header"><slot name="header" /></h1>
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    paddingless: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  padding: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid $border-lighter-color;
  background-color: $white;
  color: $text-primary-color;
  .header {
    margin-top: 0;
    margin-bottom: 0.75rem;
  }
  &.paddingless {
    padding: 0rem;
  }
}
</style>
