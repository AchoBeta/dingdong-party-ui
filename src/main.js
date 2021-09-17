import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//全局样式
import "./assets/global.css";

//引入less
import less from "less";
Vue.use(less);

//引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

//引入form-create 快速生成表单
import formCreate from "@form-create/element-ui";
Vue.use(formCreate);

//全局请求
import http from "./network/request";
Vue.use(http);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
