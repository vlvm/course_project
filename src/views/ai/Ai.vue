<template>
  <div class="wrap">
    <Navigation></Navigation>
    <div class="view">
      <a-result status="403" title="功能完善中，敬请期待">
        <template #extra>
          <a-button type="primary"> 返回 </a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Ai",
  components: {
    Navigation: () => import("@/components/Navigation"),
  },
  data() {
    return {};
  },
  computed: {
    height() {
      return this.$store.state.height;
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
  margin: auto;

  .view {
    display: flex;
    justify-content: center;
    width: 1390px;
    height: calc(100vh - 20px);
    margin: 10px;
    border-radius: 8px;
    background-color: #fff;
    .router-view {
      width: 1390px;
      border-radius: 8px;
      background-color: #fff;
    }
  }
}
</style>
