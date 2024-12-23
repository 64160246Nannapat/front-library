<template>
  <v-main style="height: 500px">
    <v-main>
      <v-container>
        <div class="header">
          <img class="header-image" src="@/assets/check-book.png" alt="Check Book" />
          <h1>ตรวจสอบหนังสือ</h1>
        </div>
        <v-card class="mx-auto my-8 card">
          <!-- Search Section -->
          <v-row class="search-section" align="center" justify="center">
            <v-col cols="12" md="4">
              <v-col cols="auto">
                <div>
                  <v-autocomplete
                    :items="['ISBN', 'TITLE', 'AUTHOR']"
                    v-model="searchCategory"
                    class="select-isbn"
                    variant="outlined"
                  ></v-autocomplete>
                </div>
              </v-col>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                class="search-text"
                v-model="searchInput"
                label="กรอกข้อมูล"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-btn color="primary" @click="searchBooks" block>
                <v-icon left>mdi-magnify</v-icon> ค้นหา
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeLibrary from '@/components/library/HomeLibrary.vue'

const searchCategory = ref('ISBN')
const searchInput = ref('')
const searchBooks = () => {
  console.log('ค้นหาหนังสือ:', searchCategory.value, searchInput.value)
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-image {
  width: 60px;
  height: auto;
  margin-right: 15px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin: 0;
}

.card {
  width: 1200px;
  height: 160px;
  display: flex; /* ใช้ Flexbox */
  flex-direction: column; /* จัดแนวเนื้อหาในแนวตั้ง */
  justify-content: center; /* จัดตำแหน่งแนวตั้งให้อยู่กึ่งกลาง */
  align-items: center; /* จัดตำแหน่งแนวนอนให้อยู่กึ่งกลาง */
  border: 2px solid #444343; /* เพิ่มเส้นกรอบ */
  border-radius: 10px; /* ปรับมุมให้มน */
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
  padding: 20px;
}

.select-isbn {
  width: 140px;
}

.search-title {
  width: 150px;
  height: 50px;
  border-radius: 5px;
  padding: 5px;
  background-color: white;
  display: flex; /* ใช้ Flexbox */
  align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
  margin-right: 10px; /* เพิ่มระยะห่างจากปุ่ม Dropdown */
  margin-left: 5px; /* ขยับ v-text-field เข้ามาใกล้ dropdown */
  flex-grow: 1;
}

.search-text {
  width: 500px;
}
</style>
