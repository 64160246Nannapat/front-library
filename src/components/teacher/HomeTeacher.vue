<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="#f8c9d3" prominent height="96" fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-icon size="36">mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="d-flex align-center">
        <img src="@/assets/logo_buu_library.png" alt="BUU Library Logo" class="logo" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="d-flex align-center">
        <div class="d-flex flex-column align-end" style="margin-right: 20px">
          <span class="name" style="font-size: 16px">{{ user.name }}</span>
          <span class="position" style="margin-top: 5px; font-size: 14px">{{ user.role }}</span>
        </div>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
      fixed
      :style="drawer ? 'width: 300px;' : 'width: 80px;'"
      class="custom-sidebar"
    >
      <v-list>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-icon>
            <!-- Horizontal Layout for Icon and Title -->
            <v-row align="center" no-gutters>
              <v-col class="d-flex justify-center" cols="auto">
                <v-img :src="item.icon" height="30px" width="30px" />
              </v-col>
              <v-col class="ml-2">
                <router-link v-if="!item.action" :to="item.link" class="custom-link">{{
                  item.title
                }}</router-link>
                <span v-else class="custom-link" @click="handleLogout">{{ item.title }}</span>
              </v-col>
            </v-row>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- Main Content -->
    <v-main class="full-height-container">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import libraryImage from '@/assets/library.png'
import logout from '@/assets/logout.png'
import checklist from '@/assets/check-list.png'
import coupon from '@/assets/coupon.png'
import historyCoupon from '@/assets/history-coupon.png'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const drawer = ref(false)

const user = ref({
  name: '',
  role: '',
})

const isTokenExpired = (token: string) => {
  const decoded: any = jwtDecode(token)
  const currentTime = Date.now() / 1000
  return decoded.exp < currentTime
}

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (refreshToken) {
    try {
      const response = await axios.post('http://bookfair.buu.in.th:8044/auth/refresh', { refreshToken })
      const { access_token, refresh_token } = response.data
      localStorage.setItem('token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      return access_token // คืนค่าใหม่ของ access_token
    } catch (error) {
      console.error('ไม่สามารถรีเฟรช token ได้:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/'
    }
  } else {
    alert('ไม่พบ Refresh Token')
    window.location.href = '/'
  }
}

const fetchUserData = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    alert('ไม่พบ Token กรุณาเข้าสู่ระบบใหม่')
    window.location.href = '/'
    return
  }

  const getUserName = (decoded: any) => {
    if (decoded.role === 'Teacher' && decoded.teacher) {
      return `${decoded.teacher.user_prefix || ''} ${decoded.teacher.user_firstName || ''} ${decoded.teacher.user_lastName || ''}`.trim()
    } else {
      return decoded.username || 'ไม่ทราบชื่อ'
    }
  }

  const getUserRole = (decoded: any) => {
    if (decoded.role === 'Teacher' && decoded.teacher) {
      return `${decoded.teacher.duty_name || ''} ${decoded.teacher.faculty_name || ''}`.trim()
    } else {
      return decoded.role || 'ไม่ทราบตำแหน่ง'
    }
  }

  if (isTokenExpired(token)) {
    const newAccessToken = await refreshToken()
    if (newAccessToken) {
      const decoded: any = jwtDecode(newAccessToken)
      user.value.name = getUserName(decoded)
      user.value.role = getUserRole(decoded)
    }
  } else {
    try {
      const decoded: any = jwtDecode(token)
      user.value.name = getUserName(decoded)
      user.value.role = getUserRole(decoded)
    } catch (error) {
      console.error('Token decoding error:', error)
    }
  }
}

onMounted(() => {
  fetchUserData()
})

const items = [
  { title: 'E-Coupon', icon: coupon, link: '/home-teacher/coupon' },
  { title: 'ประวัติการใช้คูปอง', icon: historyCoupon, link: '/home-teacher/history-coupon' },
  { title: 'แบบฟอร์มการเสนอหนังสือ', icon: libraryImage, link: '/home-teacher/book-form' },
  { title: 'สถานะการเสนอซื้อหนังสือ', icon: checklist, link: '/home-teacher/book-status' },
  { title: 'LOGOUT', icon: logout, action: 'logout' },
]

// Logout function
const handleLogout = async () => {
  try {
    console.log('Attempting to logout...')
    const response = await axios.post(
      'http://bookfair.buu.in.th:8044/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
    console.log(response.data)
    localStorage.clear()
    window.location.href = '/'
  } catch (error) {
    console.error('Logout error:', error)
    alert('การออกจากระบบล้มเหลว กรุณาลองใหม่')
  }
}
</script>

<style scoped>
.v-main {
  overflow-y: auto;
  height: 100vh;
}

.full-height-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

.v-app-bar {
  z-index: 10;
  background-color: #f8c9d3;
  height: 96px;
}

.custom-sidebar {
  position: fixed;
  top: 96px;
  height: calc(100vh - 96px);
  overflow-y: auto;
  background-color: #f5e4e5;
  max-width: 300px !important;
  transition: width 0.3s ease;
}

.custom-link {
  text-decoration: none;
  color: #333333;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.custom-link:hover {
  color: #a2a2a2;
}

.v-icon {
  color: #333333;
}

.name {
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
}

.position {
  font-size: 14px;
  color: gray;
}
</style>
