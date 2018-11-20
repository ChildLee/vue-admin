import axios from 'axios'

export class admin {

  // 查询管理员
  static getAdmins(params) {
    return axios.post('/admin/getAdmins', params)
  }

  // 创建管理员
  static addAdmin(params) {
    return axios.post('/admin/addAdmin', params)
  }

  // 封号/解封
  static adminStatus(params) {
    return axios.post('/admin/adminStatus', params)
  }

  // 删除管理员
  static delAdmin(params) {
    return axios.post('/admin/delAdmin', params)
  }

  // 修改管理员
  static updateAdmin(params) {
    return axios.post('/admin/updateAdmin', params)
  }

  // 获取管理员角色
  static getAdminGroups(params) {
    return axios.post('/admin/getAdminGroups', params)
  }

  // 修改管理员组织
  static saveAdminGroups(params) {
    return axios.post('/admin/saveAdminGroups', params)
  }

  // 获取管理员角色
  static getAdminRoles(params) {
    return axios.post('/admin/getAdminRoles', params)
  }

  // 修改管理员角色
  static saveAdminRoles(params) {
    return axios.post('/admin/saveAdminRoles', params)
  }

}
