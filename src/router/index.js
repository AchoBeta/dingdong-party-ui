import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = () => import('../views/Home')
const stageSearch = () => import('../views/StageSearch/StageSearch')
const stageManager = () => import('../views/StageManager/StageManager')
const console = () => import('../views/Console')
const login = () => import('../views/Login/Login')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/stageSearch',
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
