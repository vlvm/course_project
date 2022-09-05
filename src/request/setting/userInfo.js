/**
 * 个人信息相关接口
 */
import { api, formatParams, hostURL } from "../http";

// 获取地域列表
export function getRegionList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/user/region/list`,
    })
  );
}
// 获取学校列表
export function getSchoolList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/user/school/list`,
    })
  );
}

// 获取学科列表
export function getSubjectList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/user/subject/list`,
    })
  );
}
// 登录用户更新用户信息
export function setUserInfo(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/user/upt`,
    })
  );
}
// 登录用户修改密码
export function userChangePwd(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/user/upt/pwd`,
    })
  );
}
