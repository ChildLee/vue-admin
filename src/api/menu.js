import axios from 'axios'

export class menu {

  // 查询所有菜单
  static getMenuAll(params) {
    return axios.post('/menu/getMenuAll', params)
  }

  // 查询用户所有菜单
  static getUserMenu(params) {
    return axios.post('/menu/getUserMenu', params)
  }

  // 菜单管理
  static menuSort(params) {
    return axios.post('/menu/menuSort', params)
  }

}
