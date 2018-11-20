import axios from 'axios'

export class user {

  // 登录
  static login(params) {
    return axios.post('/login', params)
  }

  // 验证码
  static captcha(params) {
    return axios.post('/login/captcha', params)
  }

  // 退出登录
  static sign_out(params) {
    return axios.post('/login/sign_out', params)
  }

}
