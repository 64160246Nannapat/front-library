<template>
  <v-main style="height: 500px">
    <HomeStudent />

    <v-main>
      <v-container>
        <div class="header">
          <img class="header-image" src="@/assets/check-list (1).png" alt="Library Image" />
          <h1>สถานะการเสนอซื้อหนังสือ</h1>
        </div>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeStudent from '@/components/student/HomeStudent.vue'
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-image {
  width: 60px; /* กำหนดความกว้างของรูป */
  height: auto; /* ให้ความสูงปรับตามสัดส่วน */
  margin-right: 15px;
}
h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin: 0;
}
</style>
