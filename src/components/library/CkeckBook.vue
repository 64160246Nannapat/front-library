<template>
  <v-main style="height: 500px; margin-top: -30px">
    <v-main>
      <v-container>
        <div class="header">
          <img class="header-image" src="@/assets/check-book.png" alt="Check Book" />
          <h1>ตรวจสอบหนังสือ</h1>
        </div>
        <v-card class="mx-auto my-8 card">
          <!-- Search Section -->
          <v-row align="center" justify="flex-start" style="gap: 8px">
            <v-col cols="auto">
              <v-autocomplete
                :items="['ISBN', 'TITLE', 'AUTHOR']"
                v-model="searchCategory"
                class="select-isbn"
                variant="outlined"
                rounded="lg"
              ></v-autocomplete>
            </v-col>

            <v-col cols="auto">
              <v-text-field
                class="search-text"
                v-model="searchInput"
                variant="outlined"
                rounded="lg"
              />
            </v-col>

            <v-col cols="auto">
              <v-btn color="#E3E1D9" @click="searchBooks" block rounded="lg" style="margin-top: -25px; height: 50px;">
                <v-icon left>mdi-magnify</v-icon> ค้นหา
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Table Data -->
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          :loading="loading"
          item-key="id"
          :hide-default-footer="true"
          class="mt-4"
        >
        </v-data-table>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchCategory = ref('ISBN')
const searchInput = ref('')
const loading = ref(false)
const serverItems = ref([
  { id: 1, title: 'หนังสือ A', author: 'นายเอ', publisher: 'สำนักพิมพ์ใจดี', quantity: 5, isbn: '123456' },
  { id: 2, title: 'หนังสือ B', author: 'นายบี', publisher: 'สำนักพิมพ์ดี', quantity: 3, isbn: '654321' },
  { id: 3, title: 'หนังสือ C', author: 'นายซี', publisher: 'สำนักพิมพ์อันดี', quantity: 8, isbn: '112233' },
])

// Search function
const searchBooks = () => {
  console.log('ค้นหาหนังสือ:', searchCategory.value, searchInput.value)
}

// Filter items based on search input
const filteredItems = computed(() => {
  return serverItems.value.filter(item => {
    if (searchCategory.value === 'ISBN') {
      return item.isbn.includes(searchInput.value)
    } else if (searchCategory.value === 'TITLE') {
      return item.title.toLowerCase().includes(searchInput.value.toLowerCase())
    } else if (searchCategory.value === 'AUTHOR') {
      return item.author.toLowerCase().includes(searchInput.value.toLowerCase())
    }
    return true
  })
})

// Table headers
const headers = [
  { text: 'ลำดับ', align: 'start', key: 'id' },
  { text: 'ชื่อหนังสือ', key: 'title' },
  { text: 'ชื่อผู้แต่ง', key: 'author' },
  { text: 'สำนักพิมพ์', key: 'publisher' },
  { text: 'จำนวน', align: 'end', key: 'quantity' },
]
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
  width: 1000px;
  height: 150px;
  display: flex; /* ใช้ Flexbox */
  flex-direction: column; /* จัดแนวเนื้อหาในแนวตั้ง */
  justify-content: center; /* จัดตำแหน่งแนวตั้งให้อยู่กึ่งกลาง */
  align-items: center; /* จัดตำแหน่งแนวนอนให้อยู่กึ่งกลาง */
  border: 2px solid #444343; /* เพิ่มเส้นกรอบ */
  border-radius: 10px; /* ปรับมุมให้มน */
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
  padding: 20px;
}

.dropdown-isbn {
  text-align: left;
}

.select-isbn {
  width: 140px;
  margin-left: 0;
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
