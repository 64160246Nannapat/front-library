import Vuex from 'vuex'

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  },
  mutations: {
    SET_AUTH(state, { token, role }) {
      state.token = token
      state.role = role
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
    },
    CLEAR_AUTH(state) {
      state.token = null
      state.role = null
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    },
  },
  actions: {
    login({ commit }, { token, role }) {
      commit('SET_AUTH', { token, role })
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.role,
  },
})
