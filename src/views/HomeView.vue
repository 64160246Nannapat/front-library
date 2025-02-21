<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="pink" prominent>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>BUU LIBRARY</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <!-- ใช้ router-link แทน v-list-item -->
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
              <v-card-title>Welcome to BUU Library</v-card-title>
              <v-card-subtitle>
                This is the place where you can find all your library resources.
              </v-card-subtitle>
              <v-card-actions>
                <v-btn>Learn More</v-btn>
                <v-btn>Sign In</v-btn>
              </v-card-actions>
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
