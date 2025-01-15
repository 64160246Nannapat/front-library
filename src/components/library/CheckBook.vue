<template>
  <v-main style="height: 500px; margin-top: 65px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/check-book.png" alt="Check Book" />
        <h1>ตรวจสอบหนังสือ</h1>
      </div>

      <v-container>
        <!-- Search Section -->
        <v-card class="mx-auto my-8 card">
          <v-row align="center" justify="flex-start" style="gap: 8px">
            <v-col cols="auto">
              <v-select
                :items="['ISBN', 'TITLE', 'AUTHOR']"
                v-model="searchCategory"
                variant="outlined"
                rounded="lg"
                style="width: 150px"
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
                :disabled="loading"
                block
                rounded="lg"
                style="margin-top: -25px; height: 50px"
              >
                <v-icon left>mdi-magnify</v-icon> ค้นหา
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Display Results -->
        <v-row justify="center">
          <v-col v-for="(item, index) in serverItems" :key="index" cols="12" md="8">
            <v-card
              outlined
              class="mx-auto"
              style="
                width: 100%;
                max-width: 1500px;
                height: auto;
                min-height: 300px;
                text-align: left;
              "
            >
              <div
                style="
                  display: flex;
                  align-items: flex-start;
                  justify-content: flex-start;
                  gap: 10px;
                  height: auto;
                "
              >
                <!-- Image Section -->
                <v-img
                  :src="item.image"
                  alt="Book Image"
                  width="160px"
                  height="180px"
                  style="border-radius: 10px; object-fit: cover; margin-right: 10px"
                ></v-img>

                <!-- Book Info Section -->
                <div
                  style="
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    text-align: left;
                    height: auto;
                  "
                >
                  <v-card-title
                    class="text-h6"
                    style="font-size: 18px; font-weight: bold; margin-bottom: 5px"
                  >
                    {{ item.title }}
                  </v-card-title>
                  <v-card-subtitle style="font-size: 16px; margin-bottom: 5px">
                    ผู้แต่ง: {{ item.author }}
                  </v-card-subtitle>
                  <v-card-text style="font-size: 14px; line-height: 1.3; text-align: left">
                    <div>ISBN: {{ item.isbn }}</div>
                    <div>สำนักพิมพ์: {{ item.publisher }}</div>
                    <div>จำนวน: {{ item.quantity }}</div>
                    <div>พิมพ์ครั้งที่: {{ item.edition }}</div>
                    <div>รายละเอียด: {{ item.description }}</div>
                  </v-card-text>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const serverItems = ref([])

const searchCategory = ref('ISBN')
const searchInput = ref('')

// API Fake ที่ใช้จำลองข้อมูล
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
            edition: 'พิมพ์ครั้งที่ 1',
            description: '202 หน้า : ภาพประกอบ ; 19 ซม',
            image: 'https://opac1.lib.buu.ac.th/bookcover/339978/339978-fc-a.jpg',
          },
          {
            id: 2,
            title: 'วิทยาศาสตร์ของการใช้ชีวิต = The science of living',
            author: 'Dr. Stuart Farrimond',
            isbn: '9786162875434',
            publisher: 'กรุงเทพฯ : วีเลิร์น, 2565',
            quantity: 2,
            edition: 'พิมพ์ครั้งที่ 1',
            description: '256 หน้า : ภาพประกอบ ; 23 ซม',
            image: 'https://opac1.lib.buu.ac.th/bookcover/337041/337041-fc-a.jpg',
          },
          {
            id: 3,
            title: 'ร่างกายไม่เคยโกหก = What every body is saying',
            author: 'Joe Navarro',
            isbn: '9786162875687',
            publisher: 'กรุงเทพฯ : วีเลิร์น, 2565',
            quantity: 2,
            edition: 'ฉบับปรับปรุง',
            description: '301 หน้า : ภาพประกอบ ; 21 ซม',
            image: 'https://opac1.lib.buu.ac.th/bookcover/339102/339102-fc-a.jpg',
          },
          {
            id: 4,
            title: 'ภาวะลื่นไหล ทำอะไรก็ง่ายหมด = Productivity flow',
            author: 'สิทธินันท์ พลวิสุทธิ์ศักดิ์',
            isbn: '9786169373964',
            publisher: 'กรุงเทพฯ : อะไรเอ่ย, 2565',
            quantity: 2,
            edition: 'พิมพ์ครั้งที่ 1',
            description: '429 หน้า : ภาพประกอบ ; 19 ซม',
            image: 'https://opac1.lib.buu.ac.th/bookcover/339071/339071-fc-a.jpg',
          },
          {
            id: 5,
            title: 'หัวไม่ดีก็มีวิธีสอบผ่าน',
            author: 'จิตเกษม น้อยไร่ภูมิ',
            isbn: '9786165786195',
            publisher: 'กรุงเทพฯ : MD, 2565',
            quantity: 2,
            edition: 'พิมพ์ครั้งที่ 1',
            description: '191 หน้า : ภาพประกอบ ; 21 ซม',
            image: 'https://opac1.lib.buu.ac.th/bookcover/339044/339044-fc-a.jpg',
          },
          {
            id: 6,
            title: 'พจนานุกรมอ่านคนตั้งแต่หัวจรดเท้า = The dictionary of body language',
            author: 'Joe Navarro',
            isbn: '9786162875748',
            publisher: 'กรุงเทพฯ : วีเลิร์น, 2565',
            quantity: 2,
            edition: 'พิมพ์ครั้งที่ 1',
            description: '265 หน้า ; 19 ซม',
            image: 'https://opac1.lib.buu.ac.th/bookcover/339017/339017-fc-a.jpg',
          },
          {
            id: 7,
            title: 'How to grow your service business : up ธุรกิจให้โตขึ้น 8 หลัก',
            author: 'สิทธินันท์ พลวิสุทธิ์ศักดิ์',
            isbn: '9786161844721',
            publisher: 'กรุงเทพฯ : ช็อร์ตคัต อมรินทร์พริ้นติ้ง แอนด์ พับลิชชิ่ง, 2564',
            quantity: 2,
            edition: 'พิมพ์ครั้งที่ 1',
            description: '190 หน้า : ภาพประกอบ ; 21 ซม',
            image: 'https://opac1.lib.buu.ac.th/bookcover/333677/333677-fc-a.jpg',
          },
        ]
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

// ฟังก์ชันค้นหาหนังสือ
const searchBooks = () => {
  loading.value = true // เปิด loading ก่อน
  FakeAPI.fetch({ page: 1, itemsPerPage: 10 }) // ดึงข้อมูลจาก FakeAPI
    .then(({ items }) => {
      // กรองข้อมูลตามที่เลือก
      serverItems.value = items.filter((item) => {
        if (searchCategory.value === 'ISBN') {
          return item.isbn.includes(searchInput.value)
        } else if (searchCategory.value === 'TITLE') {
          return item.title.toLowerCase().includes(searchInput.value.toLowerCase())
        } else if (searchCategory.value === 'AUTHOR') {
          return item.author.toLowerCase().includes(searchInput.value.toLowerCase())
        }
        return true // กรองตามค่า default
      })
      loading.value = false // ปิด loading หลังจากเสร็จ
      searchInput.value = '' // เคลียร์ input หลังค้นหา
      searchCategory.value = 'ISBN' // รีเซ็ต dropdown
    })
    .catch((error) => {
      console.error('Error fetching books:', error)
      loading.value = false // ปิด loading เมื่อเกิดข้อผิดพลาด
    })
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
