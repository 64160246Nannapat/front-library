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
            <v-col cols="12" md="4" style="padding-right: 0">
              <v-autocomplete
                :items="['ISBN', 'TITLE', 'AUTHOR']"
                v-model="searchCategory"
                class="select-isbn"
                variant="outlined"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6" style="padding-left: 0">
              <v-text-field class="search-text" v-model="searchInput" variant="outlined" />
            </v-col>

            <v-col cols="12" md="2">
              <v-btn color="primary" @click="searchBooks" block>
                <v-icon left>mdi-magnify</v-icon> ค้นหา
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- <v-data-table
          :headers="headers"
          :items="serverItems"
          :loading="loading"
          item-key="id"
          :hide-default-footer="true"
        >
        </v-data-table> -->
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeLibrary from '@/components/library/HomeLibrary.vue'

const searchCategory = ref('ISBN')
const searchInput = ref('')
const loading = ref(false)
const serverItems = ref([])
const searchBooks = () => {
  console.log('ค้นหาหนังสือ:', searchCategory.value, searchInput.value)
}

// const headers = [
//   { title: 'ลำดับ', key: 'id', align: 'start' },
//   { title: 'ชื่อหนังสือ', key: 'title' },
//   { title: 'ชื่อผู้แต่ง', key: 'author' },
//   { title: 'สำนักพิมพ์', key: 'publisher' },
//   { title: 'จำนวน', key: 'quantity' },
//   ,
// ]

// const FakeAPI = {
//   async fetch({ page }: { page: number; itemsPerPage: number }) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const data = [
//           {
//             id: 1,
//             title: 'หนังสือ A',
//             author: 'นายเอ',
//             publisher: 'สำนักพิมพ์ใจดี',
//             quantity: 2,
//           },
//           {
//             id: 1,
//             title: 'หนังสือ A',
//             author: 'นายบี',
//             publisher: 'สำนักพิมพ์ใจดี',
//             quantity: 2,
//           },
//           {
//             id: 1,
//             title: 'หนังสือ A',
//             author: 'นายซี',
//             publisher: 'สำนักพิมพ์ใจดี',
//             quantity: 2,
//           },
//           {
//             id: 1,
//             title: 'หนังสือ A',
//             author: 'นายดี',
//             publisher: 'สำนักพิมพ์ใจดี',
//             quantity: 2,
//           },
//           {
//             id: 1,
//             title: 'หนังสือ A',
//             author: 'นายอี',
//             publisher: 'สำนักพิมพ์ใจดี',
//             quantity: 2,
//           },
//         ]

//         resolve({
//           items: data.slice(start, end),
//           total: data.length,
//         })
//       }, 500)
//     })
//   },
// }
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

.v-row {
  justify-content: flex-start; /* เริ่มจัดจากด้านซ้าย */
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
  margin-right: 0;
}

.search-title {
  width: 150px;
  height: 50px;
  border-radius: 5px;
  padding: 5px;
  background-color: white;
  display: flex; /* ใช้ Flexbox */
  align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
  flex-grow: 1;
}

.search-text {
  width: 600px;
  margin-left: 0;
}
</style>
