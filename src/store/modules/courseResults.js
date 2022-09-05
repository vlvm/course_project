const state = {
  selectRow: [],
};
const getters = {};
const actions = {
  changeSelectRow({ commit }, arr) {
    commit("changeSelectRow", arr);
  },
};
const mutations = {
  changeSelectRow(state, arr) {
    state.selectRow = arr;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
