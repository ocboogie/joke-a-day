<template>
  <div id="app">
    <div id="nav">
      <NavButton>
        I
      </NavButton>
    </div>
    <router-view />
  </div>
</template>
<script>
import NavButton from "./components/NavButton.vue";

export default {
  components: {
    NavButton
  }
};
</script>
<style lang="scss">
@import "~typeface-roboto/index.css";

body,
html {
  padding: 0;
  margin: 0;
}
html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

#app {
  font-family: roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 992px;
  padding: 10px;
  margin: auto;
}

.header {
  font-weight: 300;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
