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

  // 添加角色
  static addRole(params) {
    return axios.post('/admin/addRole', params)
  }

  // 获取权限
  static getAccess(params) {
    return axios.post('/admin/getAccess', params)
  }
}
