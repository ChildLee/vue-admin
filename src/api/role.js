import axios from 'axios'

export class role {

  // 所有权限
  static getAccessAll(params) {
    return axios.post('/role/getAccessAll', params)
  }

  // 所有角色
  static getRoleAll(params) {
    return axios.post('/role/getRoleAll', params)
  }

  // 添加角色
  static addRole(params) {
    return axios.post('/role/addRole', params)
  }

  // 删除角色
  static delRole(params) {
    return axios.post('/role/delRole', params)
  }

  // 修改角色
  static updateRole(params) {
    return axios.post('/role/updateRole', params)
  }

  // 角色添加权限
  static roleAddAccess(params) {
    return axios.post('/role/roleAddAccess', params)
  }

  // 角色添加菜单
  static roleAddMenu(params) {
    return axios.post('/role/roleAddMenu', params)
  }

  // 查询角色已有权限
  static getRoleAccess(params) {
    return axios.post('/role/getRoleAccess', params)
  }

  // 查询角色已有菜单ID
  static getRoleMenuKeys(params) {
    return axios.post('/role/getRoleMenuKeys', params)
  }

}
