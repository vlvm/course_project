/**
 * 设置教师相关接口
 */
import { api, formatParams, hostURL } from "../http";

// 获取蓝图
export function getTeacherList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/teacher/entity`,
    })
  );
}
