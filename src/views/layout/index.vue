<template>
  <div class="wrap">
    <Navigation></Navigation>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "index",
  components: {
    Navigation: () => import("@/components/Navigation"),
  },
  data() {
    return {};
  },
  computed: {},
};
</script>

<style scoped lang="less">
.wrap {
  display: flex;
  justify-content: space-between;
  width: 1440px;
  margin: auto;
  .view {
    width: 1390px;
    margin-left: 50px;
  }
}
</style>
