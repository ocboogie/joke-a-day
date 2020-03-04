<template>
  <div :class="{ paddingless }" class="card">
    <h1 v-if="$slots.header" class="header">
      <slot name="header" />
    </h1>
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
  @include card-styling;
  padding: 1rem;
  border-radius: 4px;
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
