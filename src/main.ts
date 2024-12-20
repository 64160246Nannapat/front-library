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

// main.ts หรือ file entry point
// import { createRouter, createWebHistory } from 'vue-router'

// // ตัวอย่าง Router Guard
// const router = createRouter({
//   history: createWebHistory(),
//   routes: [
//     { path: '/login', component: LoginComponent }, // หน้าเข้าสู่ระบบ
//     { path: '/', component: HomeComponent }, // หน้า Home
//     // อื่นๆ
//   ],
// })

// router.beforeEach((to, from, next) => {
//   const authRequiredPaths = ['/restricted-page'] // ตัวอย่าง route ที่ต้องล็อกอิน
//   const isLoggedIn = !!localStorage.getItem('authToken') // เช็คสถานะล็อกอิน

//   if (authRequiredPaths.includes(to.path) && !isLoggedIn) {
//     next('/login') // ไปที่หน้าเข้าสู่ระบบถ้าจำเป็น
//   } else {
//     next() // ปล่อยไปยังปลายทางถัดไปถ้าล็อกอินแล้วหรือไม่ต้องล็อกอิน
//   }
// })

// export default router
