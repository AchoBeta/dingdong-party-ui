import axios from 'axios'
import store from '../store/index'
import {Message} from 'element-ui'
import router from '../router/index'

export function request(config) {
  //1.创建axios实例
  const http = axios.create({
    baseURL: store.state.baseURL
  })
  //2.axios请求拦截器
  http.interceptors.request.use(config => {
    //携带token
    if(store.state.token){
      //在vuex找token
      let token = store.state.token;
      config.headers = {"token": token};
      return config;
    }else if(window.sessionStorage.getItem("token")){
      //在sessionStorage找token
      let token = window.sessionStorage.getItem("token");
      config.headers = {"token": token};
      return config;
    }else{
      //提示token找不到并跳转到登录页
      Message({
        message: '身份过期，请重新登录',
        type: 'error',
        duration: 1000
        ,onClose: () => {
          router.push('/login');
        }
      })
    }
  });

  //3.axios响应拦截
  http.interceptors.response.use(res => {
    return res.data;
  },err => {
    //判断token是否失效
    if(err.response.data.error_code == 20001){
      //提示token失效并跳转到登录页
      Message({
        message: err.response.data.msg,
        type: 'error',
        duration: 1000
        ,onClose: () => {
          router.push('/login');
        }
      })
    }

    return Promise.reject(err.response.data);
  });
  
  //返回promise
  return http(config);
}

export function loginRequest(config) {
  //1.创建axios实例
  const http = axios.create({
    // baseURL: 'https://www.dingdongtongxue.com/Party/party/v1/',
    baseURL: 'https://api.dingdongtongxue.com/dingdong-party',
    timeout: 5000
  })
  
  //返回promise
  return http(config);
}

export function logoutRequest(config) {
  //1.创建axios实例
  const http = axios.create({
    // baseURL: 'https://www.dingdongtongxue.com/Party/party/v1/',
    baseURL: 'https://api.dingdongtongxue.com/dingdong-party',
    timeout: 5000
  })

  //2.axios请求拦截器
  http.interceptors.request.use(config => {
    //携带token
    if(store.state.token){
      //在vuex找token
      let token = store.state.token;
      config.headers = {"token": token};
      return config;
    }else if(window.sessionStorage.getItem("token")){
      //在sessionStorage找token
      let token = window.sessionStorage.getItem("token");
      config.headers = {"token": token};
      return config;
    }else{
      //提示token找不到并跳转到登录页
      Message({
        message: '身份过期，请重新登录',
        type: 'error',
        duration: 1000
        ,onClose: () => {
          router.push('/login');
        }
      })
    }
  });

  //3.axios响应拦截
  http.interceptors.response.use(res => {
    return res.data;
  },err => {
    //判断token是否失效
    if(err.response.data.error_code == 20001){
      //提示token失效并跳转到登录页
      Message({
        message: err.response.data.msg,
        type: 'error',
        duration: 1000
        ,onClose: () => {
          router.push('/login');
        }
      })
    }
    return Promise.reject(err);
  });
  
  //返回promise
  return http(config);
}

export function pChangeRequest(config){
  
}

// 创建基本请求
function createHttp(options) {
  const instance = axios.create();
  // instance.defaults.baseURL = process.env.VUE_APP_BASE_API;
  instance.defaults.baseURL = 'https://api.dingdongtongxue.com/dingdong-party'
  instance.defaults.timeout = 0;
  instance.defaults.headers.common.token = store.state.token || sessionStorage.getItem('token');
  instance.defaults.responseType = options.responseType || 'json';
  instance.defaults.withCredentials = true;
  instance.defaults.validateStatus = (status) => {
    const result = status !== 401 && status !== 500;
    return result;
  };
  // 处理请求信息
  instance.interceptors.request.use(
    (config) => {
      config.headers['Content-Type'] = options.contentType || 'application/json; charset=UTF-8';
      config.headers.token = store.state.token ||sessionStorage.getItem('token');
      return config;
    }
  );
  // 处理返回信息
  instance.interceptors.response.use(
    (res) => {
      console.log(res);
      if (res.data && [200].includes(res.data.code)) {
        return Promise.resolve(res.data.data);
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
      const res = error.response;
      if (res && res.status === 401) {
        router.push('/login');
      }
      if (res && res.status === 500) {
        Message.error('服务器内部错误');
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );
  return instance(options);
}

const post = (options) => createHttp(Object.assign(options, { method: 'POST' }));

const get = (options) => createHttp(Object.assign(options, { method: 'GET' }));

export default {
  install(Vue) {
    Vue.prototype.$post = post;
    Vue.prototype.$get = get;
  }
};

export function userRequest(config) {
  //1.创建axios实例
  const http = axios.create({
    baseURL: 'https://api.dingdongtongxue.com'
  })
  //2.axios请求拦截器
  http.interceptors.request.use(config => {
    //携带token
    if(store.state.token){
      //在vuex找token
      let token = store.state.token;
      config.headers = {"token": token};
      return config;
    }else if(window.sessionStorage.getItem("token")){
      //在sessionStorage找token
      let token = window.sessionStorage.getItem("token");
      config.headers = {"token": token};
      return config;
    }else{
      //提示token找不到并跳转到登录页
      Message({
        message: '身份过期，请重新登录',
        type: 'error',
        duration: 1000
        ,onClose: () => {
          router.push('/login');
        }
      })
    }
  });

  //3.axios响应拦截
  http.interceptors.response.use(res => {
    return res.data;
  },err => {
    //判断token是否失效
    if(err.response.data.error_code == 20001){
      //提示token失效并跳转到登录页
      Message({
        message: err.response.data.msg,
        type: 'error',
        duration: 1000
        ,onClose: () => {
          router.push('/login');
        }
      })
    }

    return Promise.reject(err.response.data);
  });

  //返回promise
  return http(config);
}

export function userRequest2(config) {
  //1.创建axios实例
  const http = axios.create({
    baseURL: 'https://api.dingdongtongxue.com'
  })
  //2.axios请求拦截器
  http.interceptors.request.use(config => {
    //携带token
    if(store.state.token){
      //在vuex找token
      let token = store.state.token;
      config.headers = {"token": token,'Content-Type': 'application/json'};
      return config;
    }else if(window.sessionStorage.getItem("token")){
      //在sessionStorage找token
      let token = window.sessionStorage.getItem("token");
      config.headers = {"token": token};
      return config;
    }else{
      //提示token找不到并跳转到登录页
      Message({
        message: '身份过期，请重新登录',
        type: 'error',
        duration: 1000
        ,onClose: () => {
          router.push('/login');
        }
      })
    }
  });

  //3.axios响应拦截
  http.interceptors.response.use(res => {
    return res.data;
  },err => {
    //判断token是否失效
    if(err.response.data.error_code == 20001){
      //提示token失效并跳转到登录页
      Message({
        message: err.response.data.msg,
        type: 'error',
        duration: 1000
        ,onClose: () => {
          router.push('/login');
        }
      })
    }

    return Promise.reject(err.response.data);
  });

  //返回promise
  return http(config);
}
