<template>
  <a class="nav-button" href=""><slot /></a>
</template>
<style lang="scss" scoped>
.nav-button {
  @include card-styling;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 75px;
  height: 75px;
  border-radius: 50%;
}
</style>
