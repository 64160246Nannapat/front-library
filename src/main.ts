// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import { createPinia } from 'pinia'
// import '@mdi/font/css/materialdesignicons.css' // icon
// import axios from 'axios'
// import {jwtDecode} from 'jwt-decode'

// // Vuetify
// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

// import store from './store/auth' // vuex

// const vuetify = createVuetify({
//   components,
//   directives,
// })

// const isTokenExpired = (token: string) => {
//   const decoded: any = jwtDecode(token)
//   const currentTime = Date.now() / 1000 // Convert to seconds
//   return decoded.exp < currentTime // Compare expiration time
// }

// const refreshToken = async () => {
//   const refreshToken = localStorage.getItem('refresh_token')
//   if (refreshToken) {
//     try {
//       const response = await axios.post('http://localhost:3000/auth/refresh', { refreshToken })
//       const { access_token, refresh_token } = response.data
//       localStorage.setItem('token', access_token)
//       localStorage.setItem('refresh_token', refresh_token)
//       return access_token
//     } catch (error) {
//       console.error('ไม่สามารถรีเฟรช token ได้:', error)
//       localStorage.removeItem('token')
//       localStorage.removeItem('refresh_token')
//       window.location.href = '/'
//     }
//   } else {
//     alert('ไม่พบ Refresh Token')
//     window.location.href = '/'
//   }
// }

// const checkAndRefreshToken = async () => {
//   let token = localStorage.getItem('token')
//   if (!token || isTokenExpired(token)) {
//     console.log('Token หมดอายุ กำลังรีเฟรช...')
//     token = await refreshToken()
//   }
//   return token
// }

// axios.interceptors.request.use(async (config) => {
//   const token = await checkAndRefreshToken()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// }, (error) => Promise.reject(error))

// const app = createApp(App)

// app.use(router)
// app.use(vuetify)
// app.use(store)
// app.use(createPinia())
// app.config.globalProperties.$axios = axios
// app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@mdi/font/css/materialdesignicons.css' //icon
import axios from 'axios'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import store from './store/auth' // vuex

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(store)
app.use(createPinia())
app.config.globalProperties.$axios = axios
app.mount('#app')
