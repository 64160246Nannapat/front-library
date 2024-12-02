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
        <v-btn class="d-flex flex-column align-end">
          <span class="name">นันท์ณภัทร สอนสุภาพ</span>
          <span class="position">วิทยาการสารสนเทศ</span>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary class="custom-sidebar">
      <v-list>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-icon>
            <v-icon size="24">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            <router-link :to="item.link" class="custom-link">{{ item.title }}</router-link>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// export default {
//   name: 'HomeStudent',
// }

const drawer = ref(false)

const items = [
  { title: 'E-Coupon', icon: 'mdi-book', link: '/book-form-student' },
  { title: 'ประวัติการใช้คูปอง', icon: 'mdi-library-books', link: '/book-status-student' },
  { title: 'แบบฟอร์มการเสนองานหนังสือ', icon: 'mdi-book', link: '/book-form-student' },
  { title: 'สถานะการเสนอซื้อหนังสือ', icon: 'mdi-library-books', link: '/book-status-student' },
  { title: 'LOGOUT', icon: 'mdi-logout', link: '/logout' },
]
</script>

<style scoped>
.v-app-bar {
  background-color: #f8c9d3;
  height: 96px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.custom-sidebar {
  background-color: #f5e4e5;
  width: 300px !important;
  max-width: 300px !important;
}

.custom-link {
  text-decoration: none;
  color: #333333;
  font-family: 'Arial', sans-serif;
  font-size: 18px;
  font-weight: bold;
}

.custom-link:hover {
  color: #a2a2a2; /* สีข้อความตอนชี้ */
}

.v-icon {
  color: #333333;
}

.name {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
}

.position {
  font-size: 16px;
  color: gray;
}
</style>
