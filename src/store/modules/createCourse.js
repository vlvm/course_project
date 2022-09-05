// import contentData from "@/mock/question";

import {
  courseSort,
  getCourseList,
  getCourseTagAttr,
} from "@/request/course/created/course";
import { difference } from "lodash";
const state = {
  // 是否选中其他老师目录
  isOtherTeacher: false,
  // 选中的课程Id
  courseId: "",
  // 课程数据
  courseList: [],
  // 课程的学习要求等属性
  courseTagAttr: {},
  // 课程选中内容的id
  courseContentId: "",
  // 课程内容数据
  contentData: [],
  // 是否显示作答区域
  showAnswerArea: 0,
  // 选中课程内容编辑类型与多题关联的id数组
  selectItem: {
    editorType: null,
    relationData: [],
    serialNumberData: [],
  },
  // 试题编辑状态选中的数组
  contentCheckedArr: [],
  // 复制的内容数据
  copyData: {
    originCourseId: "",
    content: [],
  },
  // title 下课程内容id数组
  titleIds: [],
};
const getters = {
  courseSelectedData: (state) => {
    return state.courseList.find((o) => o.id === state.courseId) || [];
  },
  courseSelectedItemData: (state) => {
    return (
      state.contentData.find((o) => o.content.id === state.courseContentId) ||
      []
    );
  },
};
const actions = {
  getCourseListData({ commit }, catalogId) {
    return new Promise((resolve) => {
      getCourseList(catalogId).then((res) => {
        commit("setCourseList", res.extra);
        resolve(res);
      });
    });
  },
  getCourseTagAttrData({ commit }, courseId) {
    getCourseTagAttr(courseId).then((res) => {
      commit("setCourseTagAttr", res.extra);
    });
  },
  changeAnswerArea({ commit }, type) {
    commit("changeAnswerArea", type);
  },
  changeEditorType({ commit }, type) {
    commit("changeEditorType", type);
  },
  changeRelationData({ commit }, arr) {
    commit("changeRelationData", arr);
  },
  changeContentCheckedArr({ commit }, arr) {
    commit("changeContentCheckedArr", arr);
  },
};
const mutations = {
  setCourseId(state, courseId) {
    state.courseId = courseId;
  },
  setCourseList(state, data) {
    state.courseList = JSON.parse(JSON.stringify(data));
  },
  setCourseTagAttr(state, data) {
    state.courseTagAttr = data;
  },
  changeCourseContentId(state, id) {
    state.courseContentId = id;
  },
  // 选中其他老师目录
  checkedOtherItem(state, status) {
    state.isOtherTeacher = status;
  },
  // 修改作答区域状态
  changeAnswerArea(state, type) {
    state.showAnswerArea = type === 0 ? 1 : 0;
  },
  // 替换课程内容
  replaceContent(state, data) {
    if (data.length > 0) {
      let params = data.map((o, i) => {
        return {
          id: o.content.id,
          contentType: o.contentType,
          idx: i,
        };
      });
      courseSort(params, state.courseId).then((res) => {
        console.log("SORT", res);
      });
    }
    // state.contentData = JSON.parse(JSON.stringify(data));
    state.contentData = data.map((o) => {
      return {
        contentType: o.contentType,
        idx: o.idx,
        content: {
          ...o.content,
          titleLevelCaret:
            o.content.titleLevelCaret && o.content.titleLevelCaret === 1
              ? 1
              : 0,
        },
      };
    });
  },
  // 替换课程内容无排序
  replaceContentNoFilter(state, data) {
    // state.contentData = JSON.parse(JSON.stringify(data));
    state.contentData = state.contentData = data.map((o) => {
      return {
        contentType: o.contentType,
        idx: o.idx,
        content: {
          ...o.content,
          titleLevelCaret:
            o.content.titleLevelCaret && o.content.titleLevelCaret === 1
              ? 1
              : 0,
        },
      };
    });
  },
  // 设置试题编辑状态
  changeEditorType({ selectItem }, type) {
    selectItem.editorType = type;
  },
  // 获取内容多选id
  changeContentCheckedArr(state, arr) {
    state.contentCheckedArr = arr;
  },
  // 获取可以关联的试题
  changeRelationData({ selectItem }, arr) {
    selectItem.relationData = arr;
  },
  // 获取可以连续编号的试题
  changeSerialNumberData({ selectItem }, arr) {
    selectItem.serialNumberData = arr;
  },
  // 获取复制数据
  copyCourseData(state, data) {
    state.copyData = data;
  },
  // 设置title 下内容id 数组
  setTitleIds(state) {
    let arr = [];
    state.contentData.forEach((o, i) => {
      if (o.content.titleLevel === 1) {
        arr.push(i);
      }
    });
    let index = state.contentData.findIndex((o) => o.content.titleLevel === 1);
    let lastIndex = state.contentData.findLastIndex(
      (o) => o.content.titleLevel === 1
    );
    console.log(arr);
    state.titleIds = [];
    if (arr.length > 1) {
      arr.reduce((a, b) => {
        // console.log([a + 1, b]);
        state.titleIds = [
          ...state.titleIds,
          ...state.contentData.slice(a + 1, b).map((o) => {
            return o.content.id;
          }),
        ];
        return b;
      });
      if (lastIndex !== -1) {
        state.titleIds = [
          ...state.titleIds,
          ...state.contentData.slice(lastIndex + 1).map((o) => {
            return o.content.id;
          }),
        ];
      }
    } else {
      if (index !== -1) {
        state.titleIds = state.contentData.slice(index + 1).map((o) => {
          return o.content.id;
        });
      }
    }
    console.log(state.titleIds);
  },
  addTitleIds(state, arr) {
    state.titleIds = [...new Set(state.titleIds.concat(arr))];
  },
  removeTitleIds(state, arr) {
    state.titleIds = difference(state.titleIds, arr);
  },
  clearTitleIds(state) {
    state.titleIds = [];
  },
  // 清除缓存数据
  clearState(state) {
    state.isOtherTeacher = false;
    state.courseId = "";
    state.courseList = [];
    state.courseTagAttr = {};
    state.courseContentId = "";
    state.contentData = [];
    state.showAnswerArea = 0;
    state.selectItem = {
      editorType: null,
      relationData: [],
      serialNumberData: [],
    };
    state.contentCheckedArr = [];
    state.copyData = {
      originCourseId: "",
      content: [],
    };
    state.titleIds = [];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
