import contentData from "../../mock/processing";

const state = {
  // 课程选中内容的id
  courseContentId: "",
  // 角色
  role: 0,
  // 选择学生
  selectStuId: "",
  // 筛选课程
  screenCourse: "0",
  // 试题数据
  contentData: contentData,
  // 选中的试题数据
  selectItemData: {},
  // 当前选中试题
  selectItem: {
    editorType: null,
    courseContentId: "",
    relationData: [],
  },
  // 试题编辑状态选中的数组
  contentCheckedArr: [],
};
const getters = {
  questionData: (state) => {
    return state.contentData.filter((o) => o.type === 2);
  },
};
const actions = {
  changeAnswerArea({ commit }, type) {
    commit("changeAnswerArea", type);
  },
  replaceContent({ commit }, data) {
    commit("replaceContent", data);
  },
  changeEditorType({ commit }, type) {
    commit("changeEditorType", type);
  },
  changeSelectId({ commit }, id) {
    commit("changeSelectId", id);
  },
  getSelectItemData({ commit }, data) {
    commit("getSelectItemData", data);
  },
  changeRelationData({ commit }, arr) {
    commit("changeRelationData", arr);
  },
  changeContentCheckedArr({ commit }, arr) {
    commit("changeContentCheckedArr", arr);
  },
};
const mutations = {
  // 修改课程选中内容的id
  changeCourseContentId(state, id) {
    state.courseContentId = id;
  },
  // 筛选课程内容
  changeScreenCourse(state, type) {
    state.screenCourse = type;
  },
  // 替换课程内容
  replaceContent(state, data) {
    state.contentData = data;
  },
  // 设置试题编辑状态
  changeEditorType({ selectItem }, type) {
    selectItem.editorType = type;
  },
  // 修改选中试题Id
  changeSelectId({ selectItem }, id) {
    selectItem.courseContentId = id;
  },
  // 修改选中试题数据
  getSelectItemData(state, data) {
    state.selectItemData = data;
  },
  // 获取内容多选id
  changeContentCheckedArr(state, arr) {
    state.contentCheckedArr = arr;
  },
  // 获取可以关联的试题
  changeRelationData({ selectItem }, arr) {
    selectItem.relationData = arr;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
