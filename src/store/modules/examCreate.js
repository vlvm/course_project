const state = {
  // 复制的内容数据
  copyData: {
    originPaperId: "",
    content: [],
  },
};
const getters = {};
const actions = {};
const mutations = {
  // 获取复制数据
  copyPaperData(state, data) {
    state.copyData = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
