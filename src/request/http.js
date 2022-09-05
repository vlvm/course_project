/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from "axios";
axios.defaults.withCredentials = true;
import qs from "qs";
import router from "@/router/index";
import { Message } from "ant-design-vue";

const { hostURL, isProduction } = apiInit();

function apiInit() {
  // 判断是否是生产环境
  const isProduction = process.env.NODE_ENV === "production";
  // 配置接口前缀
  // const hostURL = isProduction ? "/exam" : "/exam/exam";
  const hostURL = "/exam";
  return { hostURL, isProduction };
}
// axios基本配置
const api = axios.create({
  // 默认域名
  // baseURL: hostURL,
  // baseURL: "http://8.142.35.235",
  // baseURL: "https://xnykcxt.com",
  // baseURL: "http://172.16.190.155",
  baseURL: isProduction ? window.$config.BASE_API : "",
  // 设置超时时间
  timeout: 3e5,
  // 是否要求在请求头里带上cookie
  withCredentials: true,
});

// 请求开始拦截
api.interceptors.request.use(
  (conf) => {
    // 请求带token
    // conf.headers['Authorization'] = store2('token');
    // return conf;
    return conf;
  },
  (error) => ({ status: 0, msg: error.message })
);
// 请求返回拦截
api.interceptors.response.use(
  async (response) => {
    const res = await Promise.resolve(response.data);
    return checkCode(res, response);
  },
  (error) => {
    checkStatus(error.response);
    return Promise.reject(error);
  }
);
// 后台自定义 code错误处理
const checkCode = (res, response) => {
  // code为200 时接口请求成功
  if (res.code === 0) {
    return res;
  }
  //统一处理错误
  checkStatus(res, response);
  return false;
};

// 接口错误提示
function showError(res, msg) {
  Message.error(msg);
  console.error(res, msg);
}

// http状态码错误处理
const checkStatus = (res, response) => {
  switch (res.code) {
    // 10003 未登录
    case 10003:
      showError(res, res.message);
      router.push("/login");
      // console.log(router);
      break;
    // 其他错误，直接抛出错误提示
    default:
      showError(res, `错误：${res.message}`);
      window.console.error("error Api:", response.config.url);
  }
};
// 过滤 接口函数（这些接口可以自定义 错误处理）
/* const moreCodeFn = res => {
     let url = res.config.url; //当前URL
     let urlArray = ['/auth/code/token', '/social/code/join'];
     for (let i = 0; i < urlArray.length; i++) {
       if (url.indexOf(urlArray[i]) >= 0) {
         return true;
       }
     }
     return false;
   }; */

// 解析参数
const formatParams = (method = "GET", params) => {
  switch (method) {
    case "POST":
      return { method, data: params };
    case "PUT":
      return { method, data: params };
    case "DELETE":
      return {
        method,
        data: params,
        /*headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },*/
      };
    case "GET":
      return { method, params };
    default:
      return { method, data: qs.stringify(params) };
  }
};
export { api, formatParams, hostURL, isProduction };
