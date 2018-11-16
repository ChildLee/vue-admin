import axios from 'axios'

export class admin {

  // 获取菜单
  static getMenuAll(params) {
    return axios.post('/admin/getMenuAll', params)
  }

  // 菜单排序
  static menuSort(params) {
    return axios.post('/admin/menuSort', params)
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

  // 角色添加权限
  static roleAddAccess(params) {
    return axios.post('/admin/roleAddAccess', params)
  }

  // 角色添加菜单
  static roleAddMenu(params) {
    return axios.post('/admin/roleAddMenu', params)
  }

  // 查询角色已有权限
  static getRoleAccess(params) {
    return axios.post('/admin/getRoleAccess', params)
  }

  // 查询角色已有菜单ID
  static getRoleMenuKeys(params) {
    return axios.post('/admin/getRoleMenuKeys', params)
  }

  // 获取权限
  static getAccess(params) {
    return axios.post('/admin/getAccess', params)
  }

  // 获取用户
  static getUser(params) {
    return axios.post('/admin/getUser', params)
  }

}
