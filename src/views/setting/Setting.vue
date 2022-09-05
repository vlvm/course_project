<template>
  <div class="wrap">
    <Navigation></Navigation>
    <div class="view">
      <div class="settingMenu" :style="{ height: screenHeight - 20 + 'px' }">
        <div
          v-for="item in menuList"
          :key="item.id"
          class="menuItem"
          :class="{ active: item.pathName === $route.name }"
          @click="settingMenuClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
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
  },
  data() {
    return {
      menuList: [
        {
          id: "0",
          name: "个人信息",
          path: "/settings/userInfo",
          pathName: "userInfo",
        },
        {
          id: "1",
          name: "学生分组",
          path: "/settings/stuGroup",
          pathName: "stuGroup",
        },
        {
          id: "2",
          name: "学生花名册",
          path: "/settings/stuRoster",
          pathName: "stuRoster",
        },
        {
          id: "3",
          name: "老师名单",
          path: "/settings/teacherList",
          pathName: "teacherList",
        },
        {
          id: "4",
          name: "知识蓝图",
          path: "/settings/tagTree",
          pathName: "tagTree",
        },
      ],
    };
  },
  computed: {
    screenHeight() {
      return this.$store.state.screenHeight;
    },
  },
  methods: {
    settingMenuClick({ path }) {
      this.$router.push(path);
    },
  },
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
    justify-content: space-between;
    width: 1390px;
    padding: 10px;
    .settingMenu {
      width: 170px;
      padding-top: 45px;
      background-color: #e1e5f2;
      border-radius: 8px;
      .menuItem {
        width: 150px;
        height: 36px;
        margin: auto auto 15px;
        line-height: 36px;
        border-radius: 6px;
        color: #1e3779;
        font-size: 16px;
        text-align: center;
        background-color: #fff;
        cursor: pointer;
      }
      .menuItem:hover {
        color: #fff !important;
        background-color: #6c7af0 !important;
      }
    }
    .router-view {
      width: 1190px;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 0;
      box-sizing: border-box;
      background-color: #fff;
    }
  }
}

.active {
  color: #fff !important;
  background-color: #6c7af0 !important;
}
</style>
