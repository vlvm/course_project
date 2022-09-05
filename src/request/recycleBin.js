/**
 * 回收站相关接口
 */
import { api, formatParams, hostURL } from "./http";

// 添加子目录
export function getRecycleBinList(params) {
  return api(
    Object.assign(formatParams("GET", params), {
      url: `${hostURL}/api/recycler/entity/${params.page}/${params.size}`,
    })
  );
}
// 批量删除回收站
export function deleteRecycleBinData(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/recycler/entity/del`,
    })
  );
}
// 批量恢复回收站
export function recoveryRecycleBinData(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/recycler/entity/recover`,
    })
  );
}
