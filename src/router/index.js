import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = () => import('../views/Home')
const stageSearch = () => import('../views/StageSearch/StageSearch')
const stageManager = () => import('../views/StageManager/StageManager')
const console = () => import('../views/Console')
const login = () => import('../views/Login/Login')
const conducterList =  () => import('../views/conducterList')


const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/console',
    children: [
        {
          path: 'stageSearch',
          component: stageSearch
        },{
          path: 'console',
          component: console
        },
        {
          path: 'stageManager',
          component: stageManager
        },
       {
          path: 'conducterList',
          component: conducterList
        },
        //user模块
        {
          path: 'userModule/user',
          component: () => import('../views/UserModule/User')
        },
        //activity
        {
          path: 'activityModule/activityCreate',
          component: () => import('../views/ActivityModule/ActivityCreate')
        },
        {
          path: 'activityModule/activityList',
          component: () => import('../views/ActivityModule/ActivityList')
        },
        {
            path: 'activityModule/activityLeaveApplication',
            component: () => import('../views/ActivityModule/ActivityLeaveApplication')
        }
    ]
  },
  {
    path: '/login',
    component: login
  }
]

const router = new VueRouter({
  routes
})

export default router
