import axios from "axios";
import store from "../store/index";
import { Message } from "element-ui";
import router from "../router/index";
// 创建基本请求
function createHttp(options) {
  const instance = axios.create({
    baseURL: store.state.baseURL,
    timeout: 0,
    responseType: options.responseType || "json",
    withCredentials: true,
  });
  instance.defaults.headers.common.token =
    store.state.token || sessionStorage.getItem("token");
  instance.defaults.validateStatus = (status) => {
    const result = status !== 401 && status !== 500;
    return result;
  };
  // 处理请求信息
  instance.interceptors.request.use((config) => {
    config.headers["Content-Type"] =
      options.contentType || "application/json; charset=UTF-8";
    config.headers.token = store.state.token || sessionStorage.getItem("token");
    return config;
  });
  // 处理返回信息
  instance.interceptors.response.use(
    (res) => {
      // console.log(res);
      if (res.data && [200].includes(res.data.code)) {
        return Promise.resolve(res.data);
      }
      if (res.data && [4001].includes(res.data.code)) {
        router.push("/login");
      }
      if (res.data && [700, 708].includes(res.data.code)) {
        return Promise.reject();
      }
      if (res.data && res.data.message) {
        Message.error(res.data.message);
        return Promise.reject(res);
      }
      if (!res.data && res.data.code !== 500) {
        return Promise.resolve();
      }
      return Promise.resolve(res.data);
    },
    (error) => {
      console.log(error);
      const res = error.response;
      if (res && res.status === 401) {
        Message({
          message: "身份过期，请重新登录",
          type: "error",
          duration: 1000,
          onClose: () => {
            router.push("/login");
          },
        });
      }
      if (res && res.status === 500) {
        Message.error("服务器内部错误");
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );
  return instance(options);
}

const post = (options) =>
  createHttp(Object.assign(options, { method: "POST" }));

const get = (options) => createHttp(Object.assign(options, { method: "GET" }));

const put = (options) => createHttp(Object.assign(options, { method: "PUT" }));

const del = (options) =>
  createHttp(Object.assign(options, { method: "DELETE" }));

export default {
  install(Vue) {
    Vue.prototype.$post = post;
    Vue.prototype.$get = get;
    Vue.prototype.$put = put;
    Vue.prototype.$del = del;
  },
};
