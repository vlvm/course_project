/**
 * 蓝图相关接口
 */
import { api, formatParams, hostURL } from "./http";

// 获取蓝图
export function getLabelList(subjectId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/lib/tree/${subjectId}`,
    })
  );
}
// 添加蓝图
export function addLabelContent(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/lib/entity`,
    })
  );
}
// 蓝图更名
export function renameLabelContent(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/lib/entity`,
    })
  );
}
// 删除蓝图
export function delLabelContent(params) {
  return api(
    Object.assign(formatParams("DELETE", params), {
      url: `${hostURL}/api/lib/entity`,
    })
  );
}

// 根据课程id和类型获取蓝图
export function getLabelByCourseId(courseId, type) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/lib/entities/${courseId}/${type}`,
    })
  );
}
// 根据试卷id和类型获取蓝图
export function getLabelByPaperId(paperId, type) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/lib/entities/paper/${paperId}/${type}`,
    })
  );
}

// 根据类型获取所有蓝图【列表】
export function getLabelByType(type) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/lib/list/${type}`,
    })
  );
}
// 为课程添加蓝图
export function setCourseLabel(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/calm/course`,
    })
  );
}
// 为试卷添加蓝图
export function setPaperLabel(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/plm/paper`,
    })
  );
}
// 删除课程蓝图
export function delCourseLabel(courseId, LibId) {
  return api(
    Object.assign(formatParams("DELETE"), {
      url: `${hostURL}/api/calm/course/${courseId}/${LibId}`,
    })
  );
}
// 删除试卷蓝图
export function delPaperLabel(courseId, LibId) {
  return api(
    Object.assign(formatParams("DELETE"), {
      url: `${hostURL}/api/plm/paper/${courseId}/${LibId}`,
    })
  );
}
// 获取课程某文字的所有蓝图列表
export function getCourseTxtLabel({ courseId, textId, type }) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/lib/entities/${courseId}/${textId}/${type}`,
    })
  );
}
// 批量添加课程文字的蓝图
export function setCourseTxtLabel(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/ctlm/text`,
    })
  );
}
// 批量添加考试文字的蓝图
export function setPaperTxtLabel(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/ctlm/text`,
    })
  );
}
// 批量添加课程文件的蓝图
export function setCourseFileLabel(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/calm/atta`,
    })
  );
}
// 为题批量添加蓝图（课程）
export function setCourseQuesLabel(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/cql/question`,
    })
  );
}
// 为题批量添加蓝图（考试）
export function setPaperQuesLabel(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/pql/question`,
    })
  );
}
// 课程文字删除蓝图
export function delCourseTxtLabel(courseId, textId, libId) {
  return api(
    Object.assign(formatParams("DELETE"), {
      url: `${hostURL}/api/ctlm/text/${courseId}/${textId}/${libId}`,
    })
  );
}
// 考试文字删除蓝图
export function delPaperTxtLabel(paperId, textId, libId) {
  return api(
    Object.assign(formatParams("DELETE"), {
      url: `${hostURL}/api/ptlm/text/${paperId}/${textId}/${libId}`,
    })
  );
}
// 删除课程文件的蓝图
export function delCourseFileLabel(courseId, attaId, libId) {
  return api(
    Object.assign(formatParams("DELETE"), {
      url: `${hostURL}/api/calm/atta/${courseId}/${attaId}/${libId}`,
    })
  );
}
// 删除课程试题的蓝图
export function delCourseQuestionLabel(courseId, questionId, libId) {
  return api(
    Object.assign(formatParams("DELETE"), {
      url: `${hostURL}/api/cql/question/${courseId}/${questionId}/${libId}`,
    })
  );
}
// 删除考试试题的蓝图
export function delPaperQuestionLabel(paperId, questionId, libId) {
  return api(
    Object.assign(formatParams("DELETE"), {
      url: `${hostURL}/api/pql/question/${paperId}/${questionId}/${libId}`,
    })
  );
}
// 根据类型获取某课程内容的所有蓝图列表
export function getCourseLabelsByType(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/lib/entities/${params.courseId}/${params.sourceId}/${params.type}`,
    })
  );
}
// 根据类型获取试卷某试卷内容的所有蓝图列表
export function getPaperLabelsByType(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/lib/entities/paper/${params.paperId}/${params.sourceId}/${params.type}`,
    })
  );
}
