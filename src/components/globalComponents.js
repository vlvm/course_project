/*
  设置全局组件
*/
import Vue from "vue";

import TagBox from "./TagBox";

const globalComponents = () => {
  Vue.component("TagBox", TagBox);
};

export default globalComponents;
