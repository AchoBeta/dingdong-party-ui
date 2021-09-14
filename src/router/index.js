import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const Home = () => import("../views/Home");
const Console = () => import("../views/Console");
const Login = () => import("../views/Login");
const ConductorList = () => import("../views/ConductorList");

const StageSearch = () => import("../components/StageSearch/StageSearch");
const stageManager = () => import("../components/StageManager/StageManager");

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/home",
    component: Home,
    redirect: "/home/console",
    children: [
      {
        path: "stageSearch",
        component: StageSearch,
      },
      {
        path: "console",
        component: Console,
      },
      {
        path: "stageManager",
        component: stageManager,
      },
      {
        path: "conductorList",
        component: ConductorList,
      },
      //user模块
      {
        path: "user",
        component: () => import("../components/UserModule/User"),
      },
      //activity模块
      {
        path: "activity/activityCreate",
        component: () => import("../components/ActivityModule/ActivityCreate"),
      },
      {
        path: "activity/activityList",
        component: () => import("../components/ActivityModule/ActivityList"),
      },
      {
        path: "activity/activityLeaveApplication",
        component: () =>
          import("../components/ActivityModule/ActivityLeaveApplication"),
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
