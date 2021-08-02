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
      config.headers = {"Authorization": token};
      return config;
    }else if(window.sessionStorage.getItem("Authorization")){
      //在sessionStorage找token
      let token = window.sessionStorage.getItem("Authorization");
      config.headers = {"Authorization": token};
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
    baseURL: 'https://www.dingdongtongxue.com/Party/',
    timeout: 5000
  })
  
  //返回promise
  return http(config);
}

export function logoutRequest(config) {
  //1.创建axios实例
  const http = axios.create({
    baseURL: 'https://www.dingdongtongxue.com/Party/',
    timeout: 5000
  })

  //2.axios请求拦截器
  http.interceptors.request.use(config => {
    //携带token
    if(store.state.token){
      //在vuex找token
      let token = store.state.token;
      config.headers = {"Authorization": token};
      return config;
    }else if(window.sessionStorage.getItem("Authorization")){
      //在sessionStorage找token
      let token = window.sessionStorage.getItem("Authorization");
      config.headers = {"Authorization": token};
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