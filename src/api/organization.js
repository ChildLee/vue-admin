import axios from 'axios'

export class organization {

  // 查询所有组织
  static getOrganizationAll(params) {
    return axios.post('/organization/getOrganizationAll', params)
  }

  // 添加组织
  static addOrganization(params) {
    return axios.post('/organization/addOrganization', params)
  }

  // 删除组织
  static delOrganization(params) {
    return axios.post('/organization/delOrganization', params)
  }

  // 修改组织
  static updateOrganization(params) {
    return axios.post('/organization/updateOrganization', params)
  }

}
