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
  Dialog,
  Form,
  FormItem,
  Header,
  Input,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Pagination,
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
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Header)
Vue.use(Input)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Pagination)
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
