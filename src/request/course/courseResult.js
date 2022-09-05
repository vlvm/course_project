/**
 * 课程结果相关接口
 */
import { api, formatParams, hostURL } from "../http";

// 获取目录下所有课程
export function getCourseList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/course/list/${params.catalogId}`,
    })
  );
}
// 根据课程id和类型获取蓝图
export function getCourseTag(courseId, type) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/statistics/entity/${courseId}/${type}`,
    })
  );
}
// 获取课程基础统计
export function getCourseStatistics(courseId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/statistics/entity/${courseId}`,
    })
  );
}
// 获取课程统计_按题
export function courseStatisticsBytopic(courseId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/statistics/entity/${courseId}/question`,
    })
  );
}
// 获取课程统计_按人员
export function courseStatisticsByPersion(courseId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/statistics/entity/${courseId}/student`,
    })
  );
}
// 获取课程统计_按题_人员统计
export function coursePersionStatistics(courseId, questionId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/statistics/entity/${courseId}/question/${questionId}`,
    })
  );
}
// 获取课程统计_按人员_学生答题信息
export function personStatisticsAnswer(courseId, studentId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/statistics/entity/${courseId}/student/${studentId}/question`,
    })
  );
}
// 获取课程统计_按人员_学生蓝图信息
export function personStatisticsTag(studentId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/statistics/student/${studentId}/kl`,
    })
  );
}
// 获取课程统计_按知识模块
export function courseStatisticsByModule(courseId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/statistics/entity/${courseId}/kl`,
    })
  );
}
// 创建其他（分层、分类、错题重做）课程
export function createSpecialCourse(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/other/create`,
    })
  );
}
// 获取共同错题/学生
export function getCommonWronQues(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/statistics/cqs`,
    })
  );
}
