<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="#f8c9d3" prominent height="96">
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
      class="custom-sidebar"
      :class="{ 'hidden-sidebar': !drawer }"
    >
      <v-list>
        <v-subheader style="font-weight: bold; font-size: 18px">การเสนอหนังสือ</v-subheader>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link"
          @click="closeDrawer"
        >
          <template v-slot:prepend>
            <v-img :src="item.icon" height="25px" width="25px" style="margin-right: 16px" />
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-subheader style="font-weight: bold; font-size: 18px"
          >การจัดการเสนอซื้อหนังสือ</v-subheader
        >
        <v-list-item
          v-for="item in bookItems"
          :key="item.title"
          :to="item.link"
          @click="closeDrawer"
        >
          <template v-slot:prepend>
            <v-img :src="item.icon" height="25px" width="25px" style="margin-right: 16px" />
          </template>
          <v-list-item-title v-if="drawer">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-subheader style="font-weight: bold; font-size: 18px">การจัดการงบประมาณ</v-subheader>
        <v-list-item
          v-for="item in moneyItems"
          :key="item.title"
          :to="item.link"
          @click="closeDrawer"
        >
          <template v-slot:prepend>
            <v-img :src="item.icon" height="25px" width="25px" style="margin-right: 16px" />
          </template>
          <v-list-item-title v-if="drawer">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-subheader style="font-weight: bold; font-size: 18px">การจัดการร้านค้า</v-subheader>
        <v-list-item
          v-for="item in shopItems"
          :key="item.title"
          :to="item.link"
          @click="closeDrawer"
        >
          <template v-slot:prepend>
            <v-img :src="item.icon" height="25px" width="25px" style="margin-right: 16px" />
          </template>
          <v-list-item-title v-if="drawer">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list class="logout-container">
        <v-list-item @click="handleLogout" style="margin-top: auto">
          <template v-slot:prepend>
            <v-img :src="logout" height="25px" width="25px" style="margin-right: 16px" />
          </template>
          <v-list-item-title>LOGOUT</v-list-item-title>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// Import icons
import libraryImage from '@/assets/library.png'
import logout from '@/assets/logout.png'
import checklist from '@/assets/check-list.png'
import confirmBook from '@/assets/confirm-book.png'
import checkbook from '@/assets/checkbook.png'
import budget from '@/assets/budget2.png'
import list from '@/assets/list.png'
import addShop from '@/assets/add-shop.png'
import store from '@/assets/store (1).png'

// Drawer state
const drawer = ref(false)

// User data
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
      const response = await axios.post('http://bookfair.buu.in.th:8043/auth/refresh', {
        refreshToken,
      })
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
    if (decoded.role === 'StaffLibrary' && decoded.staffLibrary) {
      return `${decoded.staffLibrary.user_prefix || ''} ${decoded.staffLibrary.user_firstName || ''} ${decoded.staffLibrary.user_lastName || ''}`.trim()
    } else {
      return decoded.username || 'ไม่ทราบชื่อ'
    }
  }

  const getUserRole = (decoded: any) => {
    if (decoded.role === 'StaffLibrary' && decoded.staffLibrary) {
      return `${decoded.staffLibrary.duty_name || ''} ${decoded.staffLibrary.faculty_name || ''}`.trim()
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

// Sidebar items
const menuItems = [
  { title: 'แบบฟอร์มการเสนอหนังสือ', icon: libraryImage, link: '/home-library/book-form' },
  { title: 'สถานะการเสนอซื้อหนังสือ', icon: checklist, link: '/home-library/book-status' },
]

const bookItems = [
  { title: 'จัดการเสนอซื้อหนังสือ', icon: confirmBook, link: '/home-library/manage-sell-book' },
  //{ title: 'ตรวจสอบหนังสือ', icon: checkbook, link: '/home-library/check-book' },
  {
    title: 'บันทึกคำขอซื้อหนังสือ',
    icon: libraryImage,
    link: '/home-library/book-form',
  },
  { title: 'รายชื่อผู้เสนอหนังสือ', icon: list, link: '/home-library/list-book-presenters' },
]

const moneyItems = [
  { title: 'ประเมินงบการซื้อหนังสือ', icon: budget, link: '/home-library/purchase-budget' },
]

const shopItems = [
  { title: 'จัดการร้านค้า', icon: addShop, link: '/home-library/add-shop' },
  { title: 'ร้านค้า', icon: store, link: '/home-library/show-shop' },
]

// Logout function
const handleLogout = async () => {
  try {
    console.log('Attempting to logout...')
    const response = await axios.post(
      'http://bookfair.buu.in.th:8043/auth/logout',
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

const closeDrawer = async () => {
  await nextTick()
  setTimeout(() => {
    drawer.value = false
  }, 300) // เพิ่มเวลาเล็กน้อยให้ UI โหลดก่อนปิด sidebar
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
  left: 0; /* ตั้งค่าตำแหน่งของ Sidebar ให้เริ่มที่ด้านซ้าย */
  height: calc(100vh - 96px);
  overflow-y: auto;
  background-color: #f5e4e5;
  width: 300px !important; /* ความกว้างของ Sidebar */
  padding-top: 20px;
  padding-left: 20px;
  transition: width 0.3s ease-in-out;
  z-index: 100; /* ทำให้ Sidebar อยู่เหนือ Main Content */
}

.hidden-sidebar {
  display: none !important;
}

.logout-container {
  position: absolute;
  bottom: 0;
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
