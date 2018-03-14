import axios from 'axios'
import admin from './admin'

axios.defaults.baseURL = 'http://127.0.0.1:3000'

// 添加响应拦截器
axios.interceptors.response.use(function (res) {
  return res.data
})

export default {
  admin
}
