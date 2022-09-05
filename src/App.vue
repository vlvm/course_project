<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>
<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
export default {
  name: "app",
  data() {
    return {
      zh_CN,
    };
  },
  mounted() {
    //禁用右键
    // document.oncontextmenu = new Function("return false");
    window.onresize = () => {
      return (() => {
        const height =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;
        this.$store.commit("setScreenHeight", height);
      })();
    };
  },
  methods: {},
};
</script>
<style lang="less">
/*滚动条宽度*/
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border-radius: 999px;
  border: 5px solid transparent;
}

::-webkit-scrollbar-track {
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1) inset;
}

::-webkit-scrollbar-thumb {
  min-height: 20px;
  background-clip: content-box;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1) inset;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
  background-color: rgba(245, 245, 245, 0);
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1) inset;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  min-height: 20px;
  background-clip: content-box;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1) inset;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

.ant-checkbox-wrapper {
  padding-right: 5px;
}
.ant-checkbox {
  .ant-checkbox-inner {
    border: 2px solid #1890ff;
  }
}

.ant-btn-warning {
  background-color: #ff9933;
  border-color: #ff9933;
  text-shadow: none;
  color: #fff;
  &:hover,
  &:focus {
    background-color: #ff9933;
    border-color: #ff9933;
    text-shadow: none;
    color: #fff;
  }
  &:active {
    background-color: #ff9933;
    border-color: #ff9933;
    text-shadow: none;
    color: #fff;
  }
  &.disabled {
    background-color: rgba(65, 72, 89, 0.15);
    border: none;
    color: #fff;
    opacity: 1;
    &:hover,
    &:focus {
      opacity: 1;
    }
  }
}
.ant-table-thead > tr > th {
  background: #f1eef3 !important;
}
* {
  touch-action: pan-y;
}
* {
  padding: 0;
  margin: 0;
  //-moz-user-select: none; /*火狐*/
  //-webkit-user-select: none; /*webkit浏览器*/
  //-ms-user-select: none; /*IE10*/
  //user-select: none;
}

/* 去掉li 的小圆点 */
li {
  list-style: none;
}

img {
  border: 0;
  /* 取消图片底侧有空白缝隙的问题 */
  vertical-align: middle;
}

html,
body {
  background-color: #c5cce5;
  color: #000;
}

#app {
  position: relative;
  width: 1440px;
  margin: 0 auto;
}

.ant-tree.ant-tree-show-line li span.ant-tree-switcher {
  background: none;
}
</style>
