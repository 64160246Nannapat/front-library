<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/bookLibrary.png" alt="Library Image" />
        <h1>จัดการเสนอซื้อหนังสือ</h1>

        <v-row align="center" class="date-status-row" justify="end">
          <v-col cols="auto">
            <v-menu
              v-model="menuDate"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, props }">
                <v-text-field
                  v-bind="props"
                  v-on="on"
                  v-model="formattedDate"
                  placeholder="dd/mm/yyyy"
                  class="custom-date-picker"
                  hide-details
                  rounded="lg"
                  readonly
                  flat
                  solo
                  prepend-inner-icon="$calendar"
                  suffix-icon="mdi-calendar"
                  variant="outlined"
                />
              </template>

              <v-date-picker v-model="selectedDate" @input="onDateChange" locale="th" />
            </v-menu>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <v-col cols="auto">
          <div class="formatted-date-display">
            <h2>{{ fullFormattedDate }}</h2>
          </div>
        </v-col>
      </v-row>

      <v-row align="center">
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
            v-model="searchText"
            placeholder="ค้นหา..."
            variant="outlined"
            class="serch-text"
            rounded="lg"
            @input="onSearch"
          ></v-text-field>
        </v-col>

        <v-col cols="auto" style="margin-top: -24px">
          <v-btn
            color="#EED3D9"
            @click="onSearch"
            class="custom-isbn"
            style="height: 40px"
            rounded="lg"
          >
            <v-icon size="20">mdi-magnify</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="auto" class="ml-auto d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">ประเภท:</h3>
          <v-select
            :items="['ทั้งหมด', 'เสนอหนังสือ', 'Book Fair']"
            v-model="searchBook"
            class="select-book"
            variant="outlined"
            rounded="lg"
            @input="onSearch"
          ></v-select>
        </v-col>
      </v-row>

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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// วันที่
const selectedDate = ref(new Date())
const menuDate = ref(false)
const searchCategory = ref('ISBN')
const searchBook = ref('ทั้งหมด')
const searchText = ref('')
const loading = ref(false)
const serverItems = ref([])

// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ข้อมูลผู้คัดเลือก', key: 'name' },
  { title: 'ชื่อหนังสือ', key: 'title' },
  { title: 'ISBN', key: 'isbn' },
  { title: 'ร้านค้า', key: 'shop' },
  { title: 'ราคาสุทธิ', key: 'price' },
  { title: 'จำนวน', key: 'quantity' },
  { title: 'รูปภาพ', key: 'image' },
  { title: 'ตรวจการซ้ำ', key: 'check' },
  { title: 'ดำเนินการ', key: 'view' },
]

// ฟอร์แมตวันที่
const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear() + 543
  return `${day}/${month}/${year}`
})

const fullFormattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value)

  const days = [
    'วันอาทิตย์',
    'วันจันทร์',
    'วันอังคาร',
    'วันพุธ',
    'วันพฤหัสบดี',
    'วันศุกร์',
    'วันเสาร์',
  ]
  const months = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ]

  const dayName = days[date.getDay()]
  const day = date.getDate()
  const monthName = months[date.getMonth()]
  const year = date.getFullYear() + 543

  return `${dayName} ที่ ${day} ${monthName} พ.ศ. ${year}`
})

// API ปลอมเพื่อเลียนแบบการดึงข้อมูล
const FakeAPI = {
  async fetch({ page }: { page: number; itemsPerPage: number }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          {
            id: 1,
            name: 'นันท์ณภัทร สอนสุภาพ',
            title: 'ความรู้สึกของเราสำคัญที่สุด',
            date: '01/12/2567',
            isbn: '9783161484100',
            shop: 'แจ่มใส',
            price: 250,
            quantity: 2,
            status: 'เสนอหนังสือ',
            author: 'อีดงกวี',
          },
          {
            id: 2,
            name: 'นันท์ณภัทร สอนสุภาพ',
            title: 'วิทยาศาสตร์ของการใช้ชีวิต = The science of living',
            date: '02/12/2567',
            isbn: '9780306406157',
            shop: 'แจ่มใส',
            price: 350,
            quantity: 1,
            status: 'Book Fair',
            author: 'Dr. Stuart Farrimond',
          },
          {
            id: 3,
            name: 'นันท์ณภัทร สอนสุภาพ',
            title:
              'คุณคางคกไปพบนักจิตบำบัด : การผจญภัยทางจิตวิทยา = Counselling for toads : a psychological adventure ',
            date: '03/12/2567',
            isbn: '9781402894656',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 3,
            status: 'Book Fair',
            author: 'Robert de Board',
          },
          {
            id: 4,
            name: 'นันท์ณภัทร สอนสุภาพ',
            title: 'ร่างกายไม่เคยโกหก = What every body is saying',
            date: '20/12/2567',
            isbn: '9787402894626',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 1,
            status: 'Book Fair',
            author: 'Joe Navarro',
          },
          {
            id: 5,
            name: 'นันท์ณภัทร สอนสุภาพ',
            title: 'ภาวะลื่นไหล ทำอะไรก็ง่ายหมด = Productivity flow',
            date: '20/12/2567',
            isbn: '9781502894626',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 1,
            status: 'เสนอหนังสือ',
            author: 'สิทธินันท์ พลวิสุทธิ์ศักดิ์',
          },
          {
            id: 6,
            name: 'นันท์ณภัทร สอนสุภาพ',
            title: 'หัวไม่ดีก็มีวิธีสอบผ่าน',
            date: '25/12/2567',
            isbn: '9786165786195',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 1,
            status: 'เสนอหนังสือ',
            author: 'จิตเกษม น้อยไร่ภูมิ',
          },
        ]

        resolve(data)
      }, 500)
    })
  },
}

const onDateChange = () => {
  onSearch()
}

const onSearch = () => {
  loading.value = true
  FakeAPI.fetch({ page: 1, itemsPerPage: 10 }).then((items) => {
    let filteredItems = items

    // กรองตามวันที่ หากเลือกวันที่เท่านั้น
    if (selectedDate.value) {
      const selectedFormattedDate = formattedDate.value
      filteredItems = filteredItems.filter((item) => item.date === selectedFormattedDate)
    }

    // หากเลือกการกรองอื่น ๆ เพิ่มเติม
    if (searchBook.value !== 'ทั้งหมด' || searchText.value) {
      // กรองตามประเภทหนังสือ
      if (searchBook.value && searchBook.value !== 'ทั้งหมด') {
        filteredItems = filteredItems.filter((item) => {
          if (searchBook.value === 'เสนอหนังสือ') return item.status === 'เสนอหนังสือ'
          if (searchBook.value === 'Book Fair') return item.status === 'Book Fair'
          return true
        })
      }

      // กรองตามหมวดหมู่การค้นหา
      if (searchText.value && searchCategory.value) {
        const searchValue = searchText.value.toLowerCase()
        filteredItems = filteredItems.filter((item) => {
          if (searchCategory.value === 'TITLE')
            return item.title.toLowerCase().includes(searchValue)
          if (searchCategory.value === 'ISBN') return item.isbn.toLowerCase().includes(searchValue)
          if (searchCategory.value === 'AUTHOR' && item.author)
            return item.author.toLowerCase().includes(searchValue)
          return true
        })
      }
    }

    // หากไม่มีการกรองเพิ่มเติม และไม่มีวันที่ที่เลือก ให้แสดงข้อมูลทั้งหมด
    if (!selectedDate.value && !searchBook.value && !searchText.value) {
      filteredItems = items
    }

    // อัปเดตข้อมูลตาราง
    serverItems.value = filteredItems

    // หากไม่มีข้อมูลให้เตือนใน console
    if (filteredItems.length === 0) {
      console.warn('No data found with the selected criteria.')
    }

    loading.value = false
  })
}

onMounted(() => {
  onSearch()
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

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin: 0;
}

.date-status-row {
  margin-bottom: 20px;
}

/* เลือกวันที่และข้อมูลในตารางวันที่ */
.custom-date-picker {
  font-size: 20px;
  white-space: nowrap; /* ห้ามตัดข้อความขึ้นบรรทัดใหม่ */
  overflow: visible; /* แสดงข้อความที่เกิน */
  text-overflow: unset; /* ปิด ellipsis (...) */
  width: 100px;
  min-width: 200px;
  text-align: center; /* จัดข้อความอยู่กลาง */
  justify-content: center;
  align-content: center;
}

.v-input--is-prepended .v-input__prepend-inner-icon {
  font-size: 28px; /* ขนาดไอคอน */
}

.v-input--is-prepended.v-input--has-icon.v-input--is-dirty .v-input__prepend-inner-icon {
  font-size: 28px; /* ไอคอนขนาดใหญ่เมื่อ input มีค่าเปลี่ยนแปลง */
}

.custom-border {
  border-radius: 15px; /* ทำให้มุมโค้ง */
  padding: 4px 8px; /* เพิ่มพื้นที่ภายในให้ข้อความไม่ชิดขอบ */
  box-sizing: border-box; /* ให้ padding ไม่กระทบกับความกว้าง */
}

.custom-width {
  width: 250px; /* กำหนดความกว้างของ input */
}

.custom-date-picker:hover {
  border-color: #707478; /* เปลี่ยนสีกรอบตอนชี้ */
}

.v-date input {
  outline: none;
}

.custom-textdate {
  font-size: 20px; /* ขนาดข้อความ */
  border: none; /* ลบเส้นขอบ */
  outline: none; /* ลบเส้นโฟกัส */
  width: 100%; /* ให้ข้อความใช้พื้นที่เต็ม */
  height: 100%; /* ให้ข้อความครอบคลุมความสูง */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
  background-color: transparent;
  white-space: normal; /* ป้องกันการหักบรรทัด */
  overflow: visible;
}

/* ตาราง */
.v-simple-table {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  font-size: 20px;
  border-collapse: collapse;
  overflow-x: auto;
  table-layout: auto;
}

th {
  padding: 16px;
  text-align: left;
  width: 16%;
  font-weight: bold;
  font-size: 24px; /* ขนาดตัวอักษร 24px */
  line-height: 40px; /* เพิ่มความสูงของแถวหัวตาราง */
}

td {
  padding: 16px;
  text-align: left;
  width: 16%;
}

.formatted-date-display {
  text-align: center;
  margin-bottom: 20px;
}

.formatted-date-display h2 {
  font-size: 20px;
  font-weight: bold;
  color: #4e484a;
}

.select-isbn {
  width: 140px;
}

.serch-text {
  width: 400px;
}

.custom-isbn {
  width: 80px;
  height: 56px;
  line-height: 56px;
}

.select-book {
  width: 200px;
}
</style>
