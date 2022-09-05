/**
 * 创建考试相关接口
 */
import { api, formatParams, hostURL } from "@/request/http";
// 获取目录下所有考试
export function getPaperList(params) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/list/${params.catalogId}`,
    })
  );
}
// 创建普通试卷
export function createPater(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/entity`,
    })
  );
}
// 创建试卷副本
export function paperCopy(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/entity/copy`,
    })
  );
}

// 试卷更名
export function renamePaper(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/entity`,
    })
  );
}

// 删除创建试卷
export function deleteCreatePaper(id) {
  return api(
    Object.assign(formatParams("DELETE"), {
      url: `${hostURL}/api/paper/entity/${id}`,
    })
  );
}
// 试卷重新排序
export function paperSort(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/entities/reset/idx`,
    })
  );
}

// 试卷移动到
export function movePaper(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/entity/move`,
    })
  );
}
// 试卷复制到
export function copyPaper(paperId, pid) {
  return api(
    Object.assign(formatParams("POST"), {
      url: `${hostURL}/api/paper/entity/${paperId}/copyTo/${pid}
`,
    })
  );
}

// 获取学生分组及学生列表
export function getGroupList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/student/group/student/paper`,
    })
  );
}
// 获取其他试卷要发布的学生列表
export function getOtherGroupList(paperId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/other/${paperId}/stulist`,
    })
  );
}
// 试卷添加文字内容
export function addPaperText(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/ptext/entity`,
    })
  );
}
// 考试添加题
export function addPaperQuestion(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/question/entity`,
    })
  );
}

// 考试试题编辑
export function changePaperQuestion(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/question/editing`,
    })
  );
}
// 根据试卷id获取试卷内容
export function getPaperContentById(paperId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/content/${paperId}`,
    })
  );
}
// 获取题修改权限的老师
export function getQuestionPeople(id) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/question/tea/${id}`,
    })
  );
}

// 获取题目正答率
export function getQuestionScoreRate(paperId, questionId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/pqs/scoreRate/${paperId}/${questionId}`,
    })
  );
}
// 获取某考试的学习要求等属性
export function getPaperTagAttr(paperId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/${paperId}/pcl`,
    })
  );
}
// 获取某试卷的所有统计点
export function getPaperStatistics(paperId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/statistics/point/entities/${paperId}`,
    })
  );
}
// 试卷添加统计点
export function addPaperStatistics(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/statistics/point/entity`,
    })
  );
}
// 试卷更新统计点
export function putPaperStatistics(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/statistics/point/entity`,
    })
  );
}
// 试卷删除统计点
export function delPaperStatistics(paperId, pointId) {
  return api(
    Object.assign(formatParams("DELETE"), {
      url: `${hostURL}/api/paper/statistics/point/entity/paper/${paperId}/point/${pointId}`,
    })
  );
}
// 整理试卷内容排序
export function paperContentSort(params, paperId) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/${paperId}/reset/idx`,
    })
  );
}
// 批量删除试卷文字
export function deletePaperText(params, paperId) {
  return api(
    Object.assign(formatParams("DELETE", params), {
      url: `${hostURL}/api/ptext/${paperId}/entity`,
    })
  );
}
// 批量删除考题
export function delPaperQuestion(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/question/entities`,
    })
  );
}

// 修改文字内容
export function changePaperText(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/ptext/content`,
    })
  );
}
// 批量删除考试内容
export function batchDeletePaperContent(params, paperId) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/${paperId}/del`,
    })
  );
}
// 批量粘贴考试内容
export function copyContent(params, paperId, originPaperId) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/${paperId}/paste/batch/${originPaperId}`,
    })
  );
}
// 修改题目的 作答属性
export function setAnswerWay(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/question/answerway`,
    })
  );
}
// 考试试题多题关联[第一个是首题]
export function setQuestionAssociated(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/question/mapping`,
    })
  );
}
// 考试试题取消多题关联
export function cancelQuestionAssociated(qId) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/paper/question/mapping/cancel/${qId}`,
    })
  );
}
// 考试试题修改分数||连续设分
export function addQuestionStore(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/question/continuous/score`,
    })
  );
}
// 考试试题修改题号||连续编号
export function setQuestionNumber(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/question/continuous/number`,
    })
  );
}
// 考试题设置必阅
export function setSelfReadOverSwitch(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/question/reading`,
    })
  );
}
// 考试--批量开关试题自阅
export function setQuesOverSwitch(params, courseId, mode) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/question/batch/${courseId}/reading/${mode}`,
    })
  );
}
//=================================================================
// 发布考试
export function publishPaper(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/publish`,
    })
  );
}

// 上传文件
export function upload(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/atta/upload`,
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
}
// 获取文件的转换状态和链接地址
export function checkFileStatus(attaId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/atta/scan/${attaId}?time=${new Date().getTime()}`,
    })
  );
}
