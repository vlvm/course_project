<template>
  <div class="wrap" :style="{ height: screenHeight - 20 + 'px' }">
    <Navigation></Navigation>
    <div class="contentView">
      <SideLeft
        :role.sync="role"
        :isOtherTeacher.sync="isOtherTeacher"
      ></SideLeft>
      <router-view
        class="router-view"
        :role="role"
        :isOtherTeacher="isOtherTeacher"
      />
    </div>
  </div>
</template>

<script>
import { getReddot } from "@/request/exam/directory";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Setting",
  components: {
    Navigation: () => import("@/components/Navigation"),
    SideLeft: () => import("./components/SideLeft1"),
  },
  data() {
    return {
      role: 1,
      isOtherTeacher: false,
      catalogIds: [],
      courseIds: [],
    };
  },
  computed: {
    screenHeight() {
      return this.$store.state.screenHeight;
    },
  },
  watch: {
    role() {
      this.getReddot();
    },
  },
  provide() {
    return {
      catalogIds: () => this.catalogIds,
      courseIds: () => this.courseIds,
      getReddot: () => this.getReddot(),
    };
  },
  mounted() {
    const timer = setInterval(() => {
      this.getReddot();
    }, 60000);

    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
    this.getReddot();
  },
  methods: {
    getReddot() {
      getReddot().then((res) => {
        this.catalogIds = res.extra.catalogIds;
        this.courseIds = res.extra.courseIds;
      });
    },
  },
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
