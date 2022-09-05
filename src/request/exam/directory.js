/**
 * 目录相关接口
 */
import { api, formatParams, hostURL } from "@/request/http";
// 获取目录
export function getDirectory(classify = 1) {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/catalog/entities/${classify}`,
    })
  );
}
// 添加子目录
export function createSubdirectory(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/catalog/entity/${params.pid}`,
    })
  );
}
// 删除目录
export function deleteDirectory(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/catalog/entity/del`,
    })
  );
}
// 目录更名
export function rename(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/catalog/entity/rename`,
    })
  );
}
// 创建目录副本
export function copyDirectory(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/api/paper/catalog/copy`,
    })
  );
}
// 目录移动到
export function moveDirectory(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/catalog/entities/moveTo/${params.tpid}`,
    })
  );
}

// 复制目录到目标目录下 7.27
export function copyDirectoryTo(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/catalog/copyto/${params.targetId}`,
    })
  );
}
// 同级目录位置重置
export function siblingSort(catalogParentId, params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/api/paper/catalog/entities/move/${catalogParentId}`,
    })
  );
}

// 获取有红点的资源ID集合
export function getReddot() {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/api/paper/catalog/reddot`,
    })
  );
}
