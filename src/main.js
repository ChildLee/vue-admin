import Vue from 'vue'
import App from './App'
import api from './api'
import store from './store'
import router from './router'
import dateformat from 'dateformat'
import {
  Aside,
  Button,
  Col,
  Container,
  Header,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Row,
  Submenu,
  Table,
  TableColumn,
  Tree
} from 'element-ui'

Vue.prototype.api = api
Vue.prototype.dateformat = dateformat

Vue.use(Aside)
Vue.use(Button)
Vue.use(Col)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Row)
Vue.use(Submenu)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tree)

new Vue({
  el: '#app',
  store,
  router,
  render: (h) => h(App)
})
