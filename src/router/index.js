import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: () => import('~/login')},
    {
      path: '/home', component: () => import('~/home'), children: [
        {path: '/', component: () => import('~/admin/role')},
        {path: '/access', component: () => import('~/admin/access')},
        {path: '/user', component: () => import('~/admin/user')},
      ],
    },
    {path: '/404', component: () => import('~/404')},
    {path: '*', redirect: {path: '/404'}},
  ],
})
