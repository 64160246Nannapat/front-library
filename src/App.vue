<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>My App</v-toolbar-title>

      <!-- แถบเมนูหลัก -->
      <v-app-bar-nav-icon @click.stop="toggleDrawer" />

      <v-app-bar-nav-icon v-if="isLoggedIn" @click.stop="toggleProfileMenu" />
    </v-app-bar>

    <!-- Drawer หรือ Sidebar -->
    <v-navigation-drawer v-model="drawer" app fixed>
      <v-list>
        <v-list-item @click="navigateToHomeStudent">
          <v-list-item-title>Home Student</v-list-item-title>
        </v-list-item>

        <!-- Home Teacher หรือ Home Admin ตามสถานะผู้ใช้งาน -->
        <v-list-item v-if="isTeacher" @click="navigateToHomeTeacher">
          <v-list-item-title>Home Teacher</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isAdmin" @click="navigateToHomeAdmin">
          <v-list-item-title>Home Admin</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isShop" @click="navigateToHomeShop">
          <v-list-item-title>Home Shop</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isLibrary" @click="navigateToHomeLibrary">
          <v-list-item-title>Home Library</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isExecutive" @click="navigateToHomeExecutive">
          <v-list-item-title>Home Executive</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isFaculty" @click="navigateToHomeFaculty">
          <v-list-item-title>Home Faculty</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <!-- โครงสร้างเนื้อหาที่ต่างกัน -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// กำหนดสถานะการล็อกอินและผู้ใช้
const drawer = ref(false)
const isLoggedIn = ref(true) // ใช้สำหรับแสดงส่วนต่าง ๆ ขึ้นอยู่กับสถานะการล็อกอิน
const isTeacher = ref(false) // ใช้สำหรับตรวจสอบว่าเป็น Teacher หรือไม่
const isAdmin = ref(false) // ใช้สำหรับตรวจสอบว่าเป็น Admin หรือไม่
const isShop = ref(false)
const isStudent = ref(false)
const isExecutive = ref(false)
const isFaculty = ref(false)
const isLibrary = ref(false)

const router = useRouter()

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const navigateToHomeStudent = () => {
  router.push({ name: 'HomeStudent' }) // เปลี่ยนเส้นทางไปยัง HomeStudent
}

const navigateToHomeTeacher = () => {
  router.push({ name: 'HomeTeacher' }) // เปลี่ยนเส้นทางไปยัง HomeTeacher
}

const navigateToHomeAdmin = () => {
  router.push({ name: 'HomeAdmin' }) // เปลี่ยนเส้นทางไปยัง HomeAdmin
}

const navigateToHomeExecutive = () => {
  router.push({ name: 'HomeExecutive' }) // เปลี่ยนเส้นทางไปยัง HomeAdmin
}

const navigateToHomeFaculty = () => {
  router.push({ name: 'HomeFaculty' }) // เปลี่ยนเส้นทางไปยัง HomeAdmin
}

const navigateToHomeLibrary = () => {
  router.push({ name: 'HomeLibrary' }) // เปลี่ยนเส้นทางไปยัง HomeAdmin
}

const navigateToHomeShop = () => {
  router.push({ name: 'HomeShop' }) // เปลี่ยนเส้นทางไปยัง HomeAdmin
}
</script>
