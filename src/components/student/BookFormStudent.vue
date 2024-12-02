<template>
  <v-main style="height: 500px">
    <HomeStudent />

    <v-main>
      <v-container>
        <h1>กรอกฟอร์มเสนอหนังสือ</h1>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import HomeStudent from '@/components/student/HomeStudent.vue'
</script>

<style scoped>
h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.v-container {
  margin-top: 20px;
}

.v-btn {
  margin-top: 20px;
}
</style>
