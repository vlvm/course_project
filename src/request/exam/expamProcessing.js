/**
 * 处理考试相关接口
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
// 删除试卷
export function deletePaper(id) {
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
// 获取处理试卷的内容
export function getPaperContent(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/handle/list/${params.paperId}`,
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
// 获取待批阅的题
export function getReviewStatusQues(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/handle/${params.paperId}/toReadTag/content`,
    })
  );
}
// 获取待回复的题
export function getReplayStatusQues(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/handle/${params.paperId}/toReplayTag/content`,
    })
  );
}
// 获取待批阅红点标识
export function getReviewStatus(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/handle/${params.paperId}/toReadTag`,
    })
  );
}
// 获取待回复红点标识
export function getReplayStatus(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/handle/${params.paperId}/toReplayTag`,
    })
  );
}

// 获取某题的学生作答情况
export function getQuesStuAnswer(paperId, qId, stuId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/handle/${paperId}/${qId}/${stuId}`,
    })
  );
}
// 获取某题的分享学生作答的列表
export function getAnswerShareData(paperId, questionId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/${paperId}/handle/share/${questionId}/respond`,
    })
  );
}
// 分享某学生某道题的作答到班级
export function shareAnswerToClass(paperId, stuId, questionId) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/paper/${paperId}/handle/${stuId}/share/${questionId}/respond`,
    })
  );
}
// 取消分享某学生某道题的作答到班级
export function delAnswerShareData(paperId, stuId, questionId) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/paper/${paperId}/handle/${stuId}/share/${questionId}/respond/cancel`,
    })
  );
}
// 批量删除提问的分享
export function delShare(params) {
  return api(
    Object.assign(formatParams("DELETE", params), {
      url: `${hostURL}/api/ask/share/del`,
    })
  );
}
// 处理考试-批阅
export function readover(params) {
  console.log(params);
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/handle/readover`,
    })
  );
}

// 获取学生试卷的提交时间和补交时间
export function stuAnswerTime(paperId, stuId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/${paperId}/handle/${stuId}/submittime`,
    })
  );
}
// 修改处理试卷的 发布时间|回收时间
export function changePaperTime(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/time/update`,
    })
  );
}
// 强制撤销某班级的发布考试
export function repealPaper(paperId) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/paper/repeal/${paperId}`,
    })
  );
}
// 处理考试-获取某题所有未作答学生的列表
export function getQuesNoSubmitStu(paperId, qId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/${paperId}/handle/unsubmit/${qId}`,
    })
  );
}
// 获取交卷情况
export function getPaperSubmitDetail(paperId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/psm/${paperId}/stu/submit/detail`,
    })
  );
}
// 获取某试卷的所有学生列表 (设置补交时间)
export function getResubmitStus(paperId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/psm/${paperId}/stu/resubmit`,
    })
  );
}
// 批量设置试卷学生的补交时间
export function setMakeUpTime(params, paperId) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/psm/${paperId}/stu/resubmit/setting`,
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
