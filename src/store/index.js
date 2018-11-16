import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id: 0,
    token: '',
  },
  getters: {
    getUserId(state) {
      return state.id
    },
    getToken(state) {
      return state.token
    },
  },
  mutations: {
    setUserId(state, id) {
      state.id = id
    },
    setToken(state, token) {
      state.token = token
    },
  },
  actions: {},
  plugins: [createPersistedState()],
})
