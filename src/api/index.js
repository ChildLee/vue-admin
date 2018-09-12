import axios from 'axios'
import admin from './admin'
import {Loading} from 'element-ui'

// axios.defaults.baseURL = 'http://127.0.0.1:3000'

// 加载动画
let loading

axios.interceptors.request.use(function (req) {
  loading = Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return req
})

// 响应拦截器
axios.interceptors.response.use(function (res) {
  loading.close()
  return res.data
})

export default {
  admin
}
