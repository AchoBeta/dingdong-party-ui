import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tokenName: 'Authorization',
    token: ''
    ,baseURL: 'https://www.dingdongtongxue.com/Party/party/v1/' //服务器接口路径
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
