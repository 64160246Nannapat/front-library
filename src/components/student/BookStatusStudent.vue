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
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-icon>
            <v-icon size="24">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            <router-link :to="item.link">{{ item.title }}</router-link>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Book Status</v-card-title>
              <v-card-subtitle> ตรวจสอบการอนุมัติหนังสือ </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)

const items = [
  { title: 'แบบฟอร์มการเสนองานหนังสือ', icon: 'mdi-book', link: '/book-form' },
  { title: 'สถานะการเสนอซื้อหนังสือ', icon: 'mdi-library-books', link: '/book-status' },
]
</script>

<style scoped>
.v-app-bar {
  background-color: #f8c9d3;
}
</style>
