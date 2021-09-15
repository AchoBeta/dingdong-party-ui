import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tokenName: "Authorization",
    token: "",
    userId: "",
    adminId: "",
    // baseURL: 'https://www.dingdongtongxue.com/Party/party/v1/' //服务器接口路径
    // baseURL: 'https://www.dingdongtongxue.com/api'
    baseURL: "https://api.dingdongtongxue.com/dingdong-party",
  },
  mutations: {},
  actions: {},
  modules: {},
});
