/**
 * 老师名单相关接口
 */
import { api, formatParams, hostURL } from "../http";

// 获取老师列表
export function getTeacherList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/teacher/friend/list`,
    })
  );
}
// 申请添加教师
export function addTeacher(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/teacher/entity/add`,
    })
  );
}
// 批量删除申请教师
export function delTeachers(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/teacher/entity/del`,
    })
  );
}
