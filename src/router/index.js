import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/', component: () => import('~/index'), children: [
      {path: '/role', component: () => import('~/admin/role')},
      {path: '/access', component: () => import('~/admin/access')},
      {path: '/user', component: () => import('~/admin/user')}
    ]
  }]
})
