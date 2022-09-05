/**
 * 考试结果相关接口
 */
import { api, formatParams, hostURL } from "@/request/http";
// 获取目录下所有考试
export function getPaperList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/paper/list/${params.catalogId}`,
    })
  );
}
// 获取某试卷的所有学生列表
export function getPaperStuList(paperId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/psm/${paperId}/stu`,
    })
  );
}
// 获取试卷统计_人员
export function getPaperStuStatistics(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/paper/statistics/entity/${params.paperId}/student`,
    })
  );
}
// 获取课程统计_按题_学生分数信息
export function getStuStatistics(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/paper/statistics/entity/${params.paperId}/student/${params.studentId}/score`,
    })
  );
}
// 获取课程统计_按题_学生班级题目分组
export function getQuesAnswerResult(params) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/statistics/entity/${params.paperId}/student/${params.studentId}/question/${params.questionId}/class`,
    })
  );
}
// 获取试卷统计_按题
export function getQuesStatistics(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/paper/statistics/entity/${params.paperId}/question`,
    })
  );
}
// 获取试卷统计_按题_按人
export function getQuesStatisticsByStu(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/paper/statistics/entity/${params.paperId}/question/student/${params.studentId}`,
    })
  );
}
// 获取试卷统计_按题_人员统计
export function getAnswerData(paperId, questionId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/statistics/entity/${paperId}/question/${questionId}`,
    })
  );
}
// 处理考试-设置发布后试卷的（公开答案、公开成绩、公开讲评）开关
export function setPaperExamSwitch(paperId, type, sw) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/paper/${paperId}/type/${type}/sw/${sw}`,
    })
  );
}
// 根据课程id和类型获取蓝图
export function getExamAnalysisTag(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/paper/statistics/entity/${params.paperId}/${params.type}`,
    })
  );
}
