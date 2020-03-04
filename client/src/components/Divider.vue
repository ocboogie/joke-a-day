<template>
  <div class="container">
    <div class="circle" />
  </div>
</template>
<style lang="scss" scoped>
.container {
  height: 1px;
  background-color: $border-lighter-color;
  position: relative;
  z-index: -10;
  .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: $border-lighter-color;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    transform: translateY(-5px);
    outline: 10px solid white;
    z-index: -20;
  }
}
</style>
