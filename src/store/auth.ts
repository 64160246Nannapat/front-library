import Vuex from 'vuex'
import axios from 'axios'

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    role: localStorage.getItem('role') || null,
  },
  mutations: {
    SET_AUTH(state, { access_token, refresh_token, role }) {
      state.token = access_token
      state.role = role
      localStorage.setItem('token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('role', role)
    },
    CLEAR_AUTH(state) {
      state.token = null
      state.refreshToken = null
      state.role = null
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('role')
    },
  },
  actions: {
    async login({ commit }, { access_token, refresh_token, role }) {
      commit('SET_AUTH', { access_token, refresh_token, role })
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    },
    async refreshToken({ commit }) {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        return commit('CLEAR_AUTH')
      }

      try {
        const response = await axios.post('http://bookfair.buu.in.th:8043/auth/refresh', { refreshToken })
        const { access_token, role } = response.data
        commit('SET_AUTH', { access_token, refresh_token: refreshToken, role })
      } catch (error) {
        console.error('Failed to refresh token:', error)
        commit('CLEAR_AUTH')
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.role,
    isTokenExpired: (state) => {
      if (state.token) {
        const tokenExpiration = JSON.parse(atob(state.token.split('.')[1])).exp
        const currentTime = Math.floor(Date.now() / 1000)
        return tokenExpiration < currentTime
      }
      return false
    },
  },
  watch: {
    '$store.state.token': function (newToken) {
      if (this.$store.getters.isTokenExpired) {
        this.$store.dispatch('refreshToken')
      }
    },
  },
})
