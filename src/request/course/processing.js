/**
 * 处理课程相关接口
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

// 删除某班级的发布课程
export function delCourse(courseId) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/course/del/handle/${courseId}`,
    })
  );
}

// 获取处理课程的内容
export function getCourseContent(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/handle/list/${params.courseId}`,
    })
  );
}

// 删除某班级的发布课程
export function deleteCourse(courseId) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/course/del/handle/${courseId}`,
    })
  );
}
// 强制撤销某班级的发布课程
export function repealCourse(courseId) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/course/repeal/${courseId}`,
    })
  );
}
// 获取课程平均用时及学生用时
export function getStuAnswerTime(courseId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/${courseId}/time`,
    })
  );
}
// 获取某课程的所有学生列表
export function getCourseStuList(courseId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/csm/${courseId}/stu`,
    })
  );
}
// 获取某题的学生作答情况
export function getQuesStuAnswer(courseId, qId, stuId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/handle/${courseId}/${qId}/${stuId}`,
    })
  );
}
// 处理课程-获取某题所有未作答学生的列表
export function getQuesNoSubmitStu(courseId, qId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/${courseId}/handle/unsubmit/${qId}`,
    })
  );
}
// 获取某题学生作答详情及老师批阅情况
export function getQuestionStuAnswer(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/handle/read`,
    })
  );
}
// 获取某个学生所有文件打开状态所有题作答的时间列表
export function getOneStuAnswerTime(courseId, stuId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/${courseId}/handle/${stuId}/respondtime`,
    })
  );
}

// 获取待批阅红点标识
export function getReviewStatus(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/handle/${params.courseId}/toReadTag`,
    })
  );
}

// 获取待批阅的题
export function getReviewStatusQues(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/handle/${params.courseId}/toReadTag/content`,
    })
  );
}

// 获取待回复红点标识
export function getReplayStatus(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/handle/${params.courseId}/toReplayTag`,
    })
  );
}

// 获取待回复的题
export function getReplayStatusQues(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/handle/${params.courseId}/toReplayTag/content`,
    })
  );
}

// 修改处理课程的 发布时间|回收时间
export function changeCourseTime(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/course/time/update`,
    })
  );
}

// 处理课程-批阅
export function readover(params) {
  console.log(params);
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/handle/readover`,
    })
  );
}
// 分享某学生某道题的作答到班级
export function shareAnswerToClass(courseId, stuId, questionId) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/course/${courseId}/handle/${stuId}/share/${questionId}/respond`,
    })
  );
}
// 获取学生课程的提交时间和补交时间
export function stuAnswerTime(courseId, stuId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/${courseId}/handle/${stuId}/submittime`,
    })
  );
}
// 获取某课程文件未打开的学生列表
export function getNoOpenFileStu(courseId, attachmentId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/${courseId}/handle/${attachmentId}/unopen`,
    })
  );
}
// 获取某题的分享学生作答的列表
export function getAnswerShareData(courseId, questionId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/${courseId}/handle/share/${questionId}/respond`,
    })
  );
}
// 取消分享某学生某道题的作答到班级
export function delAnswerShareData(courseId, stuId, questionId) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/course/${courseId}/handle/${stuId}/share/${questionId}/respond/cancel`,
    })
  );
}
export function Ask(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/ask/entity`,
    })
  );
}

/**
 * 根据分享的id获取某个分享的详情
 * @param {Int} shareid
 * @returns
 */
export function getShareinfo(shareid) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/ask/share/${shareid}/detail`,
    })
  );
}

/**
 * 获取提问列表数据
 */
export function AskList(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/ask/stu/list`,
    })
  );
}

//撤销提问
export function AskCancel(params) {
  return api(
    Object.assign(formatParams("DELETE", params), {
      url: `${hostURL}/api/ask/entities`,
    })
  );
}
// 批量分享提问
export function AskShare(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/ask/share/entities`,
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
