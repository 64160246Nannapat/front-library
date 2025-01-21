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
          <span class="name">นันท์ณภัทร สอนสุภาพ</span>
          <span class="position" style="margin-top: 5px">ร้านค้า</span>
        </div>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
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
                <!-- เพิ่ม margin-left -->
                <router-link :to="item.link" class="custom-link">{{ item.title }}</router-link>
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
import { ref } from 'vue'
import book from '@/assets/book-shop.png'
import file from '@/assets/file-shop.png'
import logout from '@/assets/logout.png'

const drawer = ref(false)

const items = [
  { title: 'จัดการหนังสือ', icon: book, link: '/home-shop/manage-book' },
  { title: 'ประวัติการขาย', icon: file, link: '/home-shop/history-sell' },
  { title: 'LOGOUT', icon: logout, link: '/' },
]
</script>

<style scoped>
.v-main {
  overflow-y: auto;
  height: 100vh;
}

.full-height-container {
  height: 100%; /* ทำให้คอนเทนเนอร์ครอบคลุมพื้นที่ของ v-main */
  display: flex;
  flex-direction: column;
  justify-content: center; /* จัดตำแหน่งฟอร์มให้อยู่ตรงกลาง */
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
  height: calc(100vh - 96px); /* ปรับความสูงให้อยู่ในกรอบหน้าจอ */
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
