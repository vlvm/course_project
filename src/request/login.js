/**
 * 登录相关接口
 */
import { api, formatParams, hostURL } from "./http";

// 登录接口
export function login(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/login/api/signin`,
    })
  );
}
// 获取验证码
export function getVerificationCode(params, type = 1) {
  return api(
    Object.assign(formatParams("GET", params), {
      url:
        type === 1
          ? `${hostURL}/login/api/code/enroll`
          : `${hostURL}/login/api/code/fpwd`,
    })
  );
}
// 注册
export function register(params) {
  return api(
    Object.assign(formatParams("POST", params), {
      url: `${hostURL}/login/api/enroll`,
    })
  );
}
// 忘记密码重置
export function resetPassword(params) {
  return api(
    Object.assign(formatParams("PUT", params), {
      url: `${hostURL}/login/api/fpwd`,
    })
  );
}

// 退出登录
export function logout() {
  return api(
    Object.assign(formatParams("GET"), {
      url: `${hostURL}/login/api/logout`,
    })
  );
}
