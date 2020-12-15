<template>
  <base-card class="info-display">
    <!-- <div class="timer">{{ secondsLeft }}</div> -->
    <h2 class="prompt">{{ prompt }}</h2>
  </base-card>
</template>
<script>
export default {
  // data: () => ({ now: Date.now() }),
  props: {
    prompt: {
      type: String,
      required: true,
    },
  },
  computed: {
    // ...mapState({
    //   prompt: state => state.lobby.prompt,
    //   roundEndAt: state => state.lobby.roundEndAt
    // }),
    // secondsLeft() {
    //   const seconds = Math.max(
    //     Math.ceil((this.roundEndAt.getTime() - this.now) / 1000),
    //     0
    //   );
    //   return `${seconds}s`;
    // }
  },
  // mounted() {
  //   this.interval = setInterval(this.updateTimerDisplay.bind(this), 1000);
  // },
  // beforeDestroy() {
  //   clearInterval(this.interval);
  // },
  methods: {
    // updateTimerDisplay() {
    //   this.now = Date.now();
    // }
  },
};
</script>
<style lang="scss" scoped>
.info-display {
  min-height: 62px;
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  padding: 0;
  padding-left: 3rem;
  .timer {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 1.15rem;
    font-size: 1rem;
  }
  .prompt {
    margin: 1rem 0;
  }
}
</style>
