import Vue from 'vue'
import Router from 'vue-router'
import balckList from '../views/blacklist/index.vue'
import add from '../views/blacklist/add.vue'
import des from '../views/blacklist/des.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: balckList,
      meta: { title: '黑名单' }
    },
    {
      path: '/add',
      component: add,
      meta: { title: '黑名单添加' }
    },
    {
      path: '/des',
      component: des,
      meta: { title: '黑名单移除查看' }
    },
    {
      path: '/404',
      name: '404',
      meta: {
        requireAuth: true
      },
      component: () => import('../views/error/404.vue')
    }
  ]
})
