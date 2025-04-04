<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container fluid>
      <div class="header">
        <img class="header-image" src="@/assets/check-book.png" alt="Check Book" />
        <h1>ตรวจสอบหนังสือ</h1>
      </div>

      <v-container>
        <!-- Search Section -->
        <v-card class="mx-auto my-8 card">
          <v-row align="center" justify="start" style="gap: 8px">
            <!-- เลือกประเภทการค้นหา -->
            <v-col cols="auto">
              <v-select
                :items="['ISBN', 'TITLE', 'AUTHOR']"
                v-model="searchCategory"
                variant="outlined"
                rounded="lg"
                style="width: 150px"
              ></v-select>
            </v-col>

            <!-- กรอกคำค้นหา -->
            <v-col cols="auto">
              <v-text-field
                class="search-text"
                v-model="searchInput"
                variant="outlined"
                rounded="lg"
                @keyup.enter="searchBooks"
              />
            </v-col>

            <!-- ปุ่มค้นหา -->
            <v-col cols="auto">
              <v-btn
                color="#E3E1D9"
                @click="searchBooks"
                :disabled="loading"
                block
                rounded="lg"
                style="margin-top: -25px; height: 50px"
              >
                <v-icon left style="margin-right: 5px">mdi-magnify</v-icon> ค้นหา
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Loading Spinner -->
        <v-row justify="center" v-if="loading">
          <v-spinner></v-spinner>
        </v-row>

        <!-- Display Results -->
        <v-row
          justify="center"
          align="center"
          style="min-height: 40vh; padding-top: 8px"
          v-if="serverItems && serverItems.length > 0"
        >
          <v-col
            cols="12"
            md="8"
            v-for="(book, index) in serverItems"
            :key="index"
            class="d-flex justify-center"
            style="margin-left: 50px"
          >
            <v-card
              outlined
              class="mx-auto"
              style="width: 100%; max-width: 1000px; height: 320px; text-align: left"
            >
              <div style="display: flex; align-items: flex-start; margin-bottom: 15px">
                <v-img
                  :src="book.bookCover"
                  alt="Book Image"
                  width="30px"
                  height="250px"
                  style="border-radius: 10px; object-fit: cover; margin-right: 5px"
                ></v-img>

                <div style="flex: 1; display: flex; flex-direction: column; text-align: left">
                  <v-card-title
                    class="text-h6"
                    style="
                      font-size: 18px;
                      font-weight: bold;
                      margin-bottom: 5px;
                      word-wrap: break-word;
                      white-space: normal;
                      overflow: hidden;
                    "
                  >
                    {{ book.title }}
                  </v-card-title>
                  <v-card-subtitle style="font-size: 16px; margin-bottom: 5px">
                    ผู้แต่ง: {{ book.author }}
                  </v-card-subtitle>
                  <v-card-text style="font-size: 14px; line-height: 1.3">
                    <div style="margin-bottom: 5px">สำนักพิมพ์: {{ book.publisher }}</div>
                    <div style="margin-bottom: 5px">จำนวน: {{ book.quantity }}</div>
                    <div style="margin-bottom: 5px">พิมพ์ครั้งที่: {{ book.edition }}</div>
                    <div style="margin-bottom: 5px">รายละเอียด: {{ book.description }}</div>
                    <div style="margin-bottom: 5px" v-for="(isbn, idx) in book.isbn" :key="idx">
                      <div>ISBN: {{ isbn }}</div>
                      <br />
                    </div>
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

interface BookItem {
  title: string
  author: string
  isbn: string[]
  publisher: string
  quantity: string
  edition: string
  description: string
  bookCover: string // รูปภาพปก
}

const serverItems = ref<BookItem[]>([]) // กำหนดให้ serverItems เป็นอาร์เรย์ของ BookItem

const searchCategory = ref('ISBN')
const searchInput = ref('')

const searchBooks = async () => {
  if (!searchInput.value) {
    alert('กรุณากรอกข้อมูลสำหรับการค้นหา')
    return
  }

  loading.value = true

  let apiUrl = ''
  if (searchCategory.value === 'ISBN') {
    apiUrl = `/api/ISBNISSN/${searchInput.value}`
  } else if (searchCategory.value === 'TITLE') {
    apiUrl = `/api/TITLE/${searchInput.value}`
  } else if (searchCategory.value === 'AUTHOR') {
    apiUrl = `/api/AUTHOR/${searchInput.value}`
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()

    if (data?.status && data?.data) {
      const uniqueBooksMap = new Map<string, BookItem>()

      data.data.Info.forEach((item: { FIELD: string; DATA: string }) => {
        const bookInfo: BookItem = {
          title: '',
          author: '',
          isbn: [],
          publisher: '',
          quantity: '',
          edition: '',
          description: '',
          bookCover: data.data.BookCover.replace(/(^"|"$|\\)/g, '') || '',
        }

        data.data.Info.forEach((infoItem: { FIELD: string; DATA: string }) => {
          switch (infoItem.FIELD) {
            case 'ISBN':
              bookInfo.isbn.push(infoItem.DATA)
              break
            case 'Author':
              bookInfo.author = infoItem.DATA
              break
            case 'Title':
              if (infoItem.DATA.length > bookInfo.title.length) {
                bookInfo.title = infoItem.DATA
              }
              break
            case 'Edition':
              bookInfo.edition = infoItem.DATA
              break
            case 'Published':
              bookInfo.publisher = infoItem.DATA
              break
            case 'Detail':
              bookInfo.quantity = infoItem.DATA
              break
            case 'Subject':
              bookInfo.description = infoItem.DATA
              break
            default:
              break
          }
        })

        bookInfo.isbn.forEach((isbn) => {
          if (!uniqueBooksMap.has(isbn)) {
            uniqueBooksMap.set(isbn, bookInfo) // เพิ่มหนังสือใหม่ที่มี ISBN นี้
          }
        })
      })

      serverItems.value = Array.from(uniqueBooksMap.values()) // ดึงค่าจาก Map ที่ไม่มี ISBN ซ้ำ

      if (serverItems.value.length === 0) {
        alert('ไม่พบข้อมูลหนังสือที่ตรงกับการค้นหา')
      }
    } else {
      serverItems.value = []
    }
  } catch (error) {
    console.error('Error fetching books:', error)
    alert('ไม่สามารถเชื่อมต่อกับ API ได้: ' + error.message)
    serverItems.value = []
  } finally {
    searchInput.value = ''
    loading.value = false
  }
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

@media (max-width: 1200px) {
  .header-image {
    width: 50px;
  }

  h1 {
    font-size: 22px;
  }

  .card {
    width: 90%;
    height: auto;
  }

  .search-text {
    width: 100%;
  }

  .search-title {
    width: 100%;
  }

  .v-btn {
    width: 100%;
    margin-top: 10px;
  }

  .v-col {
    margin-left: 0 !important;
  }
}

@media (max-width: 768px) {
  .header-image {
    width: 40px;
  }

  h1 {
    font-size: 18px;
  }

  .card {
    width: 100%;
    height: auto;
  }

  .search-text {
    width: 100%;
  }

  .v-btn {
    width: 100%;
    height: 45px;
  }
}
</style>
