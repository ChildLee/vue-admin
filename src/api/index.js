import store from '../store/index'
import router from '../router/index'
import axios from 'axios'
import {user} from './user'
import {admin} from './admin'
import {Loading, Message} from 'element-ui'

// axios.defaults.baseURL = 'http://127.0.0.1:3000' // webpack设置代理

// 加载动画
let loading

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
axios.interceptors.response.use(res => {
  if (res.data.token) store.commit('setToken', res.data.token)
  // 关闭加载动画
  loading.close()
  return res.data
}, function (err) {
  if (err.response.data.code) {
    // 20005-Token过期
    if (err.response.data.code === 20005) {
      router.push({path: '/'})
    }
    loading.close()
    Message.error(err.response.data.message)
  }
})

export default {
  user, admin,
}
