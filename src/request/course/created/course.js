/**
 * 课程相关接口
 */
import { api, formatParams, hostURL } from "../../http";

// 获取目录下所有课程
export function getCourseList(catalogId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/list/${catalogId}`,
    })
  );
}

// 获取某课程的学习要求等属性
export function getCourseTagAttr(courseId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/ccl/entity/${courseId}`,
    })
  );
}

// 创建普通课程
export function createCourse(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/entity`,
    })
  );
}

// 创建课程副本
export function createCourseCopy(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/entity/copy`,
    })
  );
}

// 课程更名
export function renameCourse(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/course/entity`,
    })
  );
}

// 删除创建课程
export function deleteCreateCourse(courseId) {
  return api(
    Object.assign(formatParams("DELETE"), {
      url: `${hostURL}/api/course/entity/${courseId}`,
    })
  );
}
// 课程移动到
export function copyCourse(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/course/entity/move`,
    })
  );
}
// 课程复制到
export function copyCourseTo(courseId, pid) {
  return api(
    Object.assign(formatParams("POST"), {
      url: `${hostURL}/api/course/entity/${courseId}/copyTo/${pid}`,
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

// 根据课程id获取课程内容
export function getCourseContentById(courseId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/content/${courseId}`,
    })
  );
}

// 根据条件获取课程内容（课程筛选）
export function filterCourseContent(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/condition`,
    })
  );
}

// 课程--设置讨论区开关
export function setCourseTalkingSwitch(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/course/talking`,
    })
  );
}
// 课程--批量开关试题自阅
export function setQuesOverSwitch(params, courseId, mode) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/question/batch/${courseId}/reading/${mode}`,
    })
  );
}

// 课程添加文字内容
export function addCourseText(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/ctext/entity`,
    })
  );
}

// 修改文字内容
export function changeCourseText(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/ctext/content`,
    })
  );
}

//批量删除课程文字
export function deleteCourseText(params, courseId) {
  return api(
    Object.assign(formatParams("DELETE", params), {
      url: `${hostURL}/api/ctext/${courseId}/entity`,
    })
  );
}

// 文字重点标签操作
export function setTextPoint(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/ctext/point`,
    })
  );
}

// 课程文字-- 课程文字修改标题属性
export function setTextTitle(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/ctext/title`,
    })
  );
}
// 课程文字-- 设置讨论区开关
export function setTextTalking(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/ctext/talking`,
    })
  );
}

// 课程添加文件
export function addCourseFile(params, courseId) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/atta/course/${courseId}`,
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
}

// 课程文件更改显示名称
export function setCourseFileName(params, courseId) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/atta/course/${courseId}/name`,
    })
  );
}
// 课程重新排序
export function setCourseSort(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/course/entities/reset/idx`,
    })
  );
}

// 删除课程文件
export function delCourseFile(params, courseId) {
  return api(
    Object.assign(formatParams("DELETE", params), {
      url: `${hostURL}/api/atta/course/${courseId}`,
    })
  );
}

// 课程文件设置必办
export function setFileMustHandle(params, courseId) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/atta/course/handle/${courseId}`,
    })
  );
}

// 课程文件设置讨论区
export function setAttachmentTalkingSwitch(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/atta/talking`,
    })
  );
}

// 获取课程文件属性内容
export function getFileArribute(courseId, attaId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/atta/properties/${courseId}/${attaId}`,
    })
  );
}

// 课程添加题
export function addCourseQuestion(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/question/entity`,
    })
  );
}

// 课程试题编辑
export function changeCourseQuestion(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/question/editing`,
    })
  );
}

// 课程试题修改分数||连续设分
export function addQuestionStore(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/question/continuous/score`,
    })
  );
}

// 课程试题题连续编号
export function setQuestionNumber(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/question/continuous/number`,
    })
  );
}

// 课程试题多题关联[第一个是首题]
export function setQuestionAssociated(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/question/mapping`,
    })
  );
}

// 课程试题取消多题关联
export function cancelQuestionAssociated(qId) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/question/mapping/cancel/${qId}`,
    })
  );
}
// 课程删除题
export function delCourseQuestion(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/question/entities`,
    })
  );
}
// 修改题目的 作答属性
export function setAnswerWay(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/question/answerway`,
    })
  );
}

// 课程题设置必做
export function addMustDoSwitch(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/question/doing`,
    })
  );
}

// 课程题设置必阅读
export function setSelfReadOverSwitch(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/question/reading`,
    })
  );
}

// 课程题设置讨论区
export function addQuestionTalkingSwitch(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/question/talking`,
    })
  );
}

// 批量删除课程内容
export function batchDeleteCourseContent(params, courseId) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/course/${courseId}/del`,
    })
  );
}

// 获取题修改权限的老师
export function getQuestionPeople(id) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/question/tea/${id}`,
    })
  );
}

// 获取题目正答率
export function getQuestionScoreRate(courseId, questionId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/qs/scoreRate/${courseId}/${questionId}`,
    })
  );
}
// 发布课程
export function publishCourse(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/publish`,
    })
  );
}

// 获取学生分组列表
export function getStuGroupList() {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/student/group/entity`,
    })
  );
}
// 获取学生分组及学生列表
export function getGroupList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/student/group/student`,
    })
  );
}
// 获取其他课程要发布的学生列表
export function getOtherGroupList(courseId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/other/${courseId}/stulist`,
    })
  );
}

// 获取学生列表
export function getStuList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/student/entity/1/9999`,
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

// 整理课程内容排序
export function courseSort(params, courseId) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/${courseId}/reset/idx`,
    })
  );
}

export function list(params, catalogId) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/course/list/${catalogId}`,
    })
  );
}
// 批量粘贴课程内容
export function copyContent(params, courseId, originCourseId) {
  console.log(params);
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/${courseId}/paste/batch/${originCourseId}`,
    })
  );
}
// 共享课程
export function shareCourse(params, courseId) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/course/share/${courseId}`,
    })
  );
}
// 取消共享
export function delShareCourse(courseId) {
  return api(
    Object.assign(formatParams("POST"), {
      url: `${hostURL}/api/course/share/cancel/${courseId}`,
    })
  );
}
// 获取共享课程的教师列表
export function getShareTeacherList(courseId) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/course/share/tealist/${courseId}`,
    })
  );
}
// 教师获取好友列表
export function getTeacherList() {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/teacher/friend/list`,
    })
  );
}
// 下载被分享的课程
export function downloadShareCourse(courseId, pid) {
  return api(
    Object.assign(formatParams("PUT"), {
      url: `${hostURL}/api/course/${courseId}/download/${pid}`,
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
