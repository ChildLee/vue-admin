import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/login', redirect: {path: '/'}},
    {path: '/', component: () => import('~/login')},
    {
      path: '/home', component: () => import('~/home'), children: [
        {path: '/', redirect: {path: '/role'}},
        {path: '/user', component: () => import('~/admin/user')},
        {path: '/organization', component: () => import('~/admin/organization')},
        {path: '/role', component: () => import('~/admin/role')},
      ],
    },
    {path: '*', component: () => import('~/404')},
  ],
})
