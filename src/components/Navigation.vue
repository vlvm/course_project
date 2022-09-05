<template>
  <div class="slider" :style="{ height: screenHeight + 'px' }">
    <div class="menu">
      <div
        v-for="item in navList"
        :key="item.id"
        :class="{ active: item.pathName === $route.meta.moduleName }"
        @click="menuClick(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Navigation",
  data() {
    return {
      navList: [
        { id: "0", name: "课程", path: "/course", pathName: "course" },
        { id: "1", name: "考试", path: "/exam", pathName: "exam" },
        { id: "2", name: "AI", path: "/ai", pathName: "ai" },
        { id: "3", name: "设置", path: "/settings", pathName: "settings" },
      ],
    };
  },
  computed: {
    screenHeight() {
      return this.$store.state.screenHeight;
    },
  },
  methods: {
    menuClick({ path }) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped lang="less">
.slider {
  width: 50px;
  min-height: 500px;
  background-color: #333951;
  text-align: center;
  color: #f6f5fa;
  font-size: 16px;
  font-weight: 400;
  line-height: 48px;

  .menu {
    padding-top: 110px;

    div {
      width: 50px;
      margin-bottom: 45px;
      text-align: center;
      cursor: pointer;
    }

    div:last-child {
      position: absolute;
      bottom: 0;
    }
  }
}

.active {
  color: #fff !important;
  background-color: #6c7af0 !important;
}
</style>
