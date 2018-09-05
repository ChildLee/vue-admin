import axios from 'axios'

export default class {
  // 获取菜单
  static getMenu(params) {
    return axios.post('/admin/getMenu', params)
  }

  // 添加角色
  static addRole(params) {
    return axios.post('/admin/addRole', params)
  }

  // 删除角色
  static delRole(params) {
    return axios.post('/admin/delRole', params)
  }

  // 修改角色
  static updateRole(params) {
    return axios.post('/admin/updateRole', params)
  }

  // 角色列表
  static getRole(params) {
    return axios.post('/admin/getRole', params)
  }

  // 获取权限
  static getAccess(params) {
    return axios.post('/admin/getAccess', params)
  }
}
