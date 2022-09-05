export function GetFileIcon(name) {
  switch (name) {
    case ".mp3":
      return "play-square";
    case ".mp4":
      return "video-camera";
    case ".pdf":
      return "file-pdf";
    case ".doc":
      return "file-word";
    default:
      return "file-unknown";
  }
}

/**
 * 格式化时间 22-07-01 22:00
 * @param {DateTime} t 要格式化的时间
 * @returns
 */
export function formatTime(t) {
  let time = new Date(t);
  return (
    (time.getFullYear() + "").substring(2, 4) +
    "-" +
    (time.getMonth() + 1 > 9
      ? time.getMonth() + 1
      : "0" + (time.getMonth() + 1)) +
    "-" +
    (time.getDate() > 9 ? time.getDate() : "0" + time.getDate()) +
    " " +
    (time.getHours() > 9 ? time.getHours() : "0" + time.getHours()) +
    ":" +
    (time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes())
  );
}

export function formatTimeNow() {
  let time = new Date();
  var data =
    time.getFullYear() +
    "-" +
    (time.getMonth() + 1 > 9
      ? time.getMonth() + 1
      : "0" + (time.getMonth() + 1)) +
    "-" +
    (time.getDate() > 9 ? time.getDate() : "0" + time.getDate()) +
    " " +
    (time.getHours() > 9 ? time.getHours() : "0" + time.getHours()) +
    ":" +
    (time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes()) +
    ":" +
    (time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds());

  return data;
}

/**
 * 格式化姓名，最多保留4个字
 * @param {String} n
 * @returns
 */
export function formatName(n) {
  return n == null ? "" : n.length > 4 ? n.substring(0, 4) + ".." : n;
}

export function mp3width(times) {
  let min = 100;
  let max = 300;
  let speed = (times * 100) / 60;
  return min + speed > max ? max : min + speed;
}
