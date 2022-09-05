import Vue from "vue";
import Vuex from "vuex";
import createCourse from "./modules/createCourse";
import processingCourse from "./modules/processingCourse";
import courseResults from "./modules/courseResults";
import examCreate from "@/store/modules/examCreate";
import { getDirectory, getReddot } from "@/request/directory";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    role: 1,
    screenHeight:
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight,
    catalogueList: [],
    redDotList: [],
    catalogIds: [],
    courseIds: [],
  },
  getters: {},
  mutations: {
    changeRole(state, role) {
      state.role = role;
    },
    setScreenHeight(state, height) {
      state.screenHeight = height;
    },
    setRedDotList(state, { catalogIds, courseIds }) {
      state.catalogIds = catalogIds;
      state.courseIds = courseIds;
    },
    setCatalogueList(state, data) {
      // state.catalogueList = JSON.parse(JSON.stringify(data));
      state.catalogueList = data;
    },
  },
  actions: {
    changeRole({ commit }, role) {
      return new Promise((resolve) => {
        commit("changeRole", role);
        resolve();
      });
    },
    // 获取红点集合
    getRedDotList({ commit }) {
      getReddot().then((res) => {
        commit("setRedDotList", res.extra);
      });
    },
    // 获取目录
    getCatalogueList({ commit }, role) {
      return new Promise((resolve) => {
        getDirectory(parseInt(role)).then((res) => {
          commit("setCatalogueList", res.extra);
          resolve(res);
        });
      });
    },
  },
  modules: {
    c: createCourse,
    p: processingCourse,
    r: courseResults,
    exam_create: examCreate,
  },
});
