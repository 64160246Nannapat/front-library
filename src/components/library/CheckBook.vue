<template>
  <v-main style="height: 500px; margin-top: 65px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/check-book.png" alt="Check Book" />
        <h1>ตรวจสอบหนังสือ</h1>
      </div>

      <v-container>
        <!-- ส่วนค้นหาข้อมูล -->
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
                @click="searchBook"
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

        <!-- ส่วนแสดงผลข้อมูล -->
        <v-row justify="center">
          <v-col cols="12" md="8" v-if="bookData && bookData.value">
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
                "
              >
                <!-- รูปภาพที่แสดงทางซ้าย -->
                <v-img
                  :src="bookData.value.bookCover"
                  alt="Book Cover"
                  width="160px"
                  height="180px"
                  style="border-radius: 10px; object-fit: cover; margin-right: 10px"
                ></v-img>

                <!-- ข้อมูลทางขวา -->
                <div
                  style="
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                  "
                >
                  <v-card-title
                    class="text-h6"
                    style="font-size: 18px; font-weight: bold; margin-bottom: 5px"
                  >
                    {{ bookData.value.title }}
                  </v-card-title>
                  <v-card-subtitle style="font-size: 16px; margin-bottom: 5px">
                    ผู้แต่ง: {{ bookData.value.author }}
                  </v-card-subtitle>
                  <v-card-text style="font-size: 14px; line-height: 1.3; text-align: left">
                    <div>ISBN: {{ bookData.value.isbn }}</div>
                    <div>สำนักพิมพ์: {{ bookData.value.published }}</div>
                    <div>พิมพ์ครั้งที่: {{ bookData.value.edition }}</div>
                    <div>รายละเอียด: {{ bookData.value.detail }}</div>
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
const searchInput = ref('')
const searchCategory = ref('ISBN')
const bookData = ref<BookData | null>(null)

interface BookData {
  title: string
  author: string
  isbn: string
  edition: string
  published: string
  detail: string
  subjects: string[]
  bookCover: string
}

const endpointMap: Record<string, string> = {
  ISBN: 'ISBNISSN',
  TITLE: 'TITLE',
  AUTHOR: 'AUTHOR',
}

const searchBook = async () => {
  loading.value = true
  try {
    if (!searchInput.value.trim()) {
      alert('โปรดป้อนข้อมูลการค้นหา')
      loading.value = false
      return
    }

    const endpoint = endpointMap[searchCategory.value]
    if (!endpoint) {
      throw new Error('ประเภทการค้นหาไม่ถูกต้อง')
    }

    let apiUrl = ''
    switch (searchCategory.value) {
      case 'ISBN':
        apiUrl = `https://info.lib.buu.ac.th/apilib/Walai/CheckSearch/ISBNISSN/${searchInput.value}`
        break
      case 'TITLE':
        apiUrl = `https://info.lib.buu.ac.th/apilib/Walai/CheckSearch/${endpoint}/${searchInput.value}`
        break
      case 'AUTHOR':
        apiUrl = `https://info.lib.buu.ac.th/apilib/Walai/CheckSearch/${endpoint}/${searchInput.value}`
        break
      default:
        throw new Error('ประเภทการค้นหาไม่ถูกต้อง')
    }

    console.log('Fetching from API:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })

    // ตรวจสอบ response status
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log('API Response:', result)

    // ตรวจสอบว่า API ส่งข้อมูลมาในรูปแบบที่ถูกต้อง
    if (result.status && result.data) {
      const { data } = result
      bookData.value = {
        title: data.title || 'ไม่มีข้อมูล',
        author: data.author || 'ไม่มีข้อมูล',
        isbn: data.Info?.find((item) => item.FIELD === 'ISBN')?.DATA || 'ไม่มีข้อมูล',
        edition: data.Info?.find((item) => item.FIELD === 'Edition')?.DATA || 'ไม่มีข้อมูล',
        published: data.Info?.find((item) => item.FIELD === 'Published')?.DATA || 'ไม่มีข้อมูล',
        detail: data.Info?.find((item) => item.FIELD === 'Detail')?.DATA || 'ไม่มีข้อมูล',
        subjects:
          data.Info?.filter((item) => item.FIELD === 'Subject').map((item) => item.DATA) || [],
        bookCover: data.BookCover || '',
      }
      console.log('bookData after API response:', bookData.value)
    } else {
      alert(result.message || 'ไม่พบข้อมูลหนังสือ')
    }
  } catch (error) {
    console.error('Error:', error)
    alert(`เกิดข้อผิดพลาด: ${error.message}`)
  } finally {
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
</style>
