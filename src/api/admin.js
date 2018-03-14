import axios from 'axios'

export default class {
  // 获取菜单
  static getMenu(params) {
    return axios.post('/admin/getMenu', params)
  }

  // 获取角色
  static getRole(params) {
    return axios.post('/admin/getRole', params)
  }

  // 获取权限
  static getAccess(params) {
    return axios.post('/admin/getAccess', params)
  }
}
