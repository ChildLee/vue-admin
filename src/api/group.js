import axios from 'axios'

export class group {

  // 查询所有组织
  static getGroupAll(params) {
    return axios.post('/group/getGroupAll', params)
  }

  // 添加组织
  static addGroup(params) {
    return axios.post('/group/addGroup', params)
  }

  // 删除组织
  static delGroup(params) {
    return axios.post('/group/delGroup', params)
  }

  // 修改组织
  static updateGroup(params) {
    return axios.post('/group/updateGroup', params)
  }

  // 获取组织已有角色
  static getGroupRoles(params) {
    return axios.post('/group/getGroupRoles', params)
  }

  // 修改组织角色
  static saveGroupRoles(params) {
    return axios.post('/group/saveGroupRoles', params)
  }

}
