/**
 * 学生分组相关接口
 */
import { api, formatParams, hostURL } from "../http";

// 获取学生分组
export function getStugroupList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/student/group/entity`,
    })
  );
}
// 添加学生分组
export function addStugroup(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/student/group/entity/add`,
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
// 修改学生分组
export function changeGroupName(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/student/group/entity/update`,
    })
  );
}
// 批量删除学生分组
export function delGroup(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/student/group/entity/del`,
    })
  );
}
// 批量添加学生到分组
export function groupAddStudent(params, groupID) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/student/group/entity/${groupID}/add`,
    })
  );
}

// 删除分组下学生
export function deleteGroupStudent(params, groupID) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/student/group/entity/${groupID}/del`,
    })
  );
}
