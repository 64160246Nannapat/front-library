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
              <v-select
                :items="['ISBN', 'TITLE', 'AUTHOR']"
                v-model="searchCategory"
                class="select-isbn"
                variant="outlined"
                rounded="lg"
              ></v-select>
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
              <v-btn
                color="#E3E1D9"
                @click="searchBooks"
                block
                rounded="lg"
                style="margin-top: -25px; height: 50px"
              >
                <v-icon left>mdi-magnify</v-icon> ค้นหา
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <v-data-table
          :headers="headers"
          :items="serverItems"
          :loading="loading"
          item-key="id"
          :hide-default-footer="true"
        >
        </v-data-table>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedDate = ref(new Date())
const menuDate = ref(false)
const loading = ref(false)
const serverItems = ref([])
const searchCategory = ref('ISBN')
const searchInput = ref('')
const searchBook = ref('ทั้งหมด')
// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ชื่อหนังสือ', key: 'title' },
  { title: 'ชื่อผู้แต่ง', key: 'author' },
  { title: 'สำนักพิมพ์', key: 'publisher' },
  { title: 'จำนวน', key: 'quantity' },
]

const FakeAPI = {
  async fetch({ page, itemsPerPage }: { page: number; itemsPerPage: number }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          {
            id: 1,
            title: 'ความรู้สึกของเราสำคัญที่สุด',
            author: 'อีดงกวี, อีซองจิก, อันฮายัน',
            isbn: '9786161857707',
            publisher: 'กรุงเทพฯ : สปริงบุ๊กส์, 2566',
            quantity: 2,
          },
          {
            id: 2,
            title: 'วิทยาศาสตร์ของการใช้ชีวิต = The science of living',
            author: 'Dr. Stuart Farrimond',
            isbn: '9786162875434',
            publisher: 'กรุงเทพฯ : วีเลิร์น, 2565',
            quantity: 2,
          },
          {
            id: 3,
            title: 'ร่างกายไม่เคยโกหก = What every body is saying',
            author: 'Joe Navarro',
            isbn: '9786162875687',
            publisher: 'กรุงเทพฯ : วีเลิร์น, 2565',
            quantity: 2,
          },
          {
            id: 4,
            title: 'ภาวะลื่นไหล ทำอะไรก็ง่ายหมด = Productivity flow',
            author: 'สิทธินันท์ พลวิสุทธิ์ศักดิ์',
            isbn: '9786169373964',
            publisher: 'กรุงเทพฯ : อะไรเอ่ย, 2565',
            quantity: 2,
          },
          {
            id: 5,
            title: 'หัวไม่ดีก็มีวิธีสอบผ่าน',
            author: 'จิตเกษม น้อยไร่ภูมิ',
            isbn: '9786165786195',
            publisher: 'กรุงเทพฯ : MD, 2565',
            quantity: 2,
          },
        ]

        // Slicing data based on pagination
        const start = (page - 1) * itemsPerPage
        const end = page * itemsPerPage
        resolve({
          items: data.slice(start, end),
          total: data.length,
        })
      }, 500)
    })
  },
}

//ค้นหาตาม filter
const searchBooks = () => {
  loading.value = true // กำหนดให้เป็น true ก่อนทำการ fetch ข้อมูล
  FakeAPI.fetch({ page: 1, itemsPerPage: 10 }) // เรียก fetch จาก FakeAPI
    .then(({ items }) => {
      // บันทึกข้อมูลตามเงื่อนไขการกรอง
      serverItems.value = items.filter((item) => {
        if (searchCategory.value === 'ISBN') {
          return item.isbn.includes(searchInput.value)
        } else if (searchCategory.value === 'TITLE') {
          return item.title.toLowerCase().includes(searchInput.value.toLowerCase())
        } else if (searchCategory.value === 'AUTHOR') {
          return item.author.toLowerCase().includes(searchInput.value.toLowerCase())
        }
        return true // หากไม่เลือกหมวดหมู่ใดจะคืนค่าข้อมูลทั้งหมด
      })
      loading.value = false // ปิด loading หลังจากโหลดเสร็จ

      searchInput.value = '' //เคลียร์ text input
      searchCategory.value = 'ISBN' //เคลียร์ dropdown
    })
    .catch((error) => {
      console.error('Error fetching books:', error)
      loading.value = false // หากเกิดข้อผิดพลาดให้ปิด loading
    })
}


//ตัวกรองในการค้นหา
const filteredItems = computed(() => {
  return serverItems.value.filter((item) => {
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
