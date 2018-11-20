import axios from 'axios'

export class login {

  // 登录
  static login(params) {
    return axios.post('/login', params)
  }

  // 验证码
  static captcha(params) {
    return axios.post('/login/captcha', params)
  }

  // 修改密码
  static updatePassword(params) {
    return axios.post('/login/updatePassword', params)
  }

  // 退出登录
  static sign_out(params) {
    return axios.post('/login/sign_out', params)
  }

}
