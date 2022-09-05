/**
 * 目录相关接口
 */
import { api, formatParams, hostURL } from "./http";
// 获取目录
export function getDirectory(classify = 1) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/catalog/entities/${classify}`,
    })
  );
}
// 添加子目录
export function createSubdirectory(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/catalog/entity/${params.pid}`,
    })
  );
}
// 删除目录
export function deleteDirectory(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/catalog/entity/del`,
    })
  );
}
// 目录更名
export function rename(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/catalog/entity/rename`,
    })
  );
}
// 创建目录副本
export function copyDirectory(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/catalog/copy`,
    })
  );
}
/*// 移动目录
export function moveDirectory(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/catalog/entities/move/${params.tpid}`,
    })
  );
}*/
// 移动目录 7.27
export function moveDirectory(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/catalog/entities/moveTo/${params.tpid}`,
    })
  );
}
/*// 复制目录到目标目录下
export function copyDirectoryTo(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/catalog/copyto/${params.targetId}`,
    })
  );
}*/
// 复制目录到目标目录下 7.27
export function copyDirectoryTo(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/catalog/copyto/${params.targetId}`,
    })
  );
}
// 同级目录位置重置
export function siblingSort(catalogParentId, params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/catalog/entities/move/${catalogParentId}`,
    })
  );
}

// 获取有红点的资源ID集合
export function getReddot() {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/catalog/reddot`,
    })
  );
}
