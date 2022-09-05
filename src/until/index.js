// 获取数组中的连续数字 [1,2,3,7,9]=>[1,2,3]
export function getSuccessiveNumber(arr) {
  let result = [],
    i = 0;
  result[i] = [arr[0]];
  arr.reduce(function (prev, cur) {
    cur - prev === 1 ? result[i].push(cur) : (result[++i] = [cur]);
    return cur;
  });
  if (result.length >= 1) return result[0];
  return result;
}
// 上传文件处理,获取文件名
export function getFileName(path) {
  let pos1 = path.lastIndexOf("/");
  let pos2 = path.lastIndexOf("\\");
  let pos = Math.max(pos1, pos2);
  if (pos < 0) return path;
  else return path.substring(pos + 1);
}
// 数组内容左移
export function upGo(fieldData, index) {
  if (index !== 0) {
    fieldData[index] = fieldData.splice(index - 1, 1, fieldData[index])[0];
  } else {
    fieldData.push(fieldData.shift());
  }
}
// 数组内容右移
export function downGo(fieldData, index) {
  if (index != fieldData.length - 1) {
    fieldData[index] = fieldData.splice(index + 1, 1, fieldData[index])[0];
  } else {
    fieldData.unshift(fieldData.splice(index, 1)[0]);
  }
}
export function getPercent(num, total) {
  /// <summary>
  /// 求百分比
  /// </summary>
  /// <param name="num">当前数</param>
  /// <param name="total">总数</param>
  num = parseFloat(num);
  total = parseFloat(total);
  if (isNaN(num) || isNaN(total)) {
    return "-";
  }
  return total <= 0 ? "0%" : Math.round((num / total) * 10000) / 100.0 + "%";
}
