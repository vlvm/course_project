<template>
  <div class="wrap" :style="{ height: screenHeight - 20 + 'px' }">
    <Navigation></Navigation>
    <div class="contentView">
      <SideLeft></SideLeft>
      <router-view class="router-view" />
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Setting",
  components: {
    Navigation: () => import("@/components/Navigation"),
    SideLeft: () => import("./components/SideLeft1"),
  },
  data() {
    return {};
  },
  computed: {
    screenHeight() {
      return this.$store.state.screenHeight;
    },
  },
  methods: {},
};
</script>

<style scoped lang="less">
.wrap {
  display: flex;
  justify-content: space-between;
  width: 1440px;
  height: 100vh;
  margin: auto;

  .contentView {
    display: flex;
    justify-content: space-between;
    width: 1380px;
    min-height: 500px;
    margin-top: 10px;
    border-radius: 8px;

    .router-view {
      display: flex;
      justify-content: space-between;
      width: 1130px;
      height: calc(100vh - 20px);
      min-height: 500px;
      //padding: 0 10px;
      border-radius: 8px;
      margin-bottom: 0;
      box-sizing: border-box;
      //background-color: #fff;
    }
  }
}

.active {
  color: #fff !important;
  background-color: #6c7af0 !important;
}
</style>
