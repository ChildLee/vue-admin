import axios from 'axios'
import {Loading, Message} from 'element-ui'
import store from '../store/index'
import router from '../router/index'
import {admin} from './admin'
import {menu} from './menu'
import {group} from './group'
import {role} from './role'
import {user} from './user'

// axios.defaults.baseURL = 'http://127.0.0.1:3000' // webpack可以设置代理

// 加载动画
let loading = null

// 请求拦截器
axios.interceptors.request.use(req => {
  req.headers.Authorization = store.getters.getToken
  // 打开加载动画
  loading = Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  return req
})

// 响应拦截器
axios.interceptors.response.use(
  res => {
    if (res.data.token) store.commit('setToken', res.data.token)
    // 关闭加载动画
    loading.close()
    return res.data
  },
  err => {
    if (err.response.data && err.response.data.code) {
      // 20005-Token过期
      if (err.response.data.code === 20005) {
        store.commit('setUserId', null)
        store.commit('setToken', null)
        router.push({path: '/'})
      }
      loading.close()
      Message.error(err.response.data.message)
    }
    return err
  },
)

export default {
  admin, menu, group, role, user,
}
