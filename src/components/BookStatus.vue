<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container fluid>
      <div class="header">
        <img class="header-image" src="@/assets/check-list (1).png" alt="Library Image" />
        <h1>สถานะการเสนอซื้อหนังสือ</h1>

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
                  readonly
                  flat
                  solo
                  prepend-inner-icon="$calendar"
                  suffix-icon="mdi-calendar"
                  variant="outlined"
                  rounded="lg"
                />
              </template>

              <v-date-picker v-model="selectedDate" @input="menuDate = false" locale="th" />
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

      <v-row>
        <v-tabs v-model="selectedTab" class="mb-4" hide-slider>
          <v-tab
            value="กำลังดำเนินการ"
            class="rounded-lg px-4 py-2"
            :class="selectedTab === 'กำลังดำเนินการ' ? 'active-tab' : 'inactive-tab'"
          >
            กำลังดำเนินการ
          </v-tab>
          <v-tab
            value="อนุมัติการซื้อ"
            class="rounded-lg px-4 py-2"
            :class="selectedTab === 'อนุมัติการซื้อ' ? 'active-tab' : 'inactive-tab'"
          >
            อนุมัติการซื้อ
          </v-tab>
          <v-tab
            value="ไม่อนุมัติการซื้อ"
            class="rounded-lg px-4 py-2"
            :class="selectedTab === 'ไม่อนุมัติการซื้อ' ? 'active-tab' : 'inactive-tab'"
          >
            ไม่อนุมัติการซื้อ
          </v-tab>
        </v-tabs>
      </v-row>

      <!-- ตารางข้อมูล -->
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        @update:options="loadItems"
        show-items-per-page="false"
        :hide-default-footer="true"
      >
        <template v-slot:item.form_status="{ item }">
          <span :class="getStatusClass(item.form_status)">
            {{ item.form_status }}
          </span>
        </template>
      </v-data-table-server>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'

interface BookItem {
  offer_form_id: number
  book_title: string
  ISBN: string
  book_price: number
  book_quantity: number
  form_status: string
}

// วันที่
const selectedDate = ref(new Date())
const menuDate = ref(false)
const itemsPerPage = ref(1000000)
const loading = ref(false)
const totalItems = ref(0)
const serverItems = ref<BookItem[]>([])
const selectedTab = ref('กำลังดำเนินการ')

const getStatusClass = (status: string) => {
  switch (status) {
    case 'กำลังดำเนินการ':
      return 'text-warning' // สีเหลือง
    case 'อนุมัติการซื้อ':
      return 'text-success' // สีเขียว
    case 'ไม่อนุมัติการซื้อ':
      return 'text-error' // สีแดง
    default:
      return ''
  }
}

// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'rowIndex', align: 'start' },
  { title: 'ชื่อหนังสือ', key: 'book_title' },
  { title: 'ISBN', key: 'ISBN' },
  { title: 'ราคาสุทธิ', key: 'book_price' },
  { title: 'จำนวน', key: 'book_quantity' },
  { title: 'สถานะ', key: 'form_status' },
]

// ดึง Token จาก Local Storage
const token = localStorage.getItem('token')

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

// ฟังก์ชันกรองข้อมูลตามวันที่
const filterDataByDateAndStatus = (data: any[], selectedDate: Date, selectedTab: string) => {
  const startOfDay = new Date(selectedDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(selectedDate)
  endOfDay.setHours(23, 59, 59, 999)

  return data
    .filter((item) => {
      const createdAt = new Date(item.createdAt)
      return createdAt >= startOfDay && createdAt <= endOfDay
    })
    .filter((item) => item.form_status === selectedTab) // กรองตามสถานะ
    .map((item, index) => ({
      ...item,
      rowIndex: index + 1, // เพิ่มลำดับแถว
    }))
}

// API ดึงข้อมูลจากเซิร์ฟเวอร์
const fetchDataFromAPI = async ({
  page,
  itemsPerPage,
  token,
}: {
  page: number
  itemsPerPage: number
  token: string
}) => {
  try {
    const response = await axios.get('http://localhost:3000/offer-form/user', {
      params: {
        page,
        itemsPerPage,
      },
      headers: {
        Authorization: `Bearer ${token}`, // ใช้ token เพื่อระบุผู้ใช้
      },
    })

    const data = response.data
    return {
      items: data.map((item: any) => ({
        ...item,
        createdAt: item.createdAt, // เก็บ `createdAt` ไว้กรองใน frontend
      })),
      total: data.length,
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { items: [], total: 0 }
  }
}

// Watch วันที่
watch(
  [selectedDate, selectedTab],
  async () => {
    if (!token) {
      console.error('User not authenticated')
      return
    }

    loading.value = true

    // ดึงข้อมูลทั้งหมดจาก API
    const { items } = await fetchDataFromAPI({
      page: 1,
      itemsPerPage: itemsPerPage.value,
      token,
    })

    // กรองข้อมูลและเพิ่ม `rowIndex`
    const filteredItems = filterDataByDateAndStatus(items, selectedDate.value, selectedTab.value)

    // อัปเดต `serverItems` ให้มีลำดับ
    serverItems.value = filteredItems
    totalItems.value = filteredItems.length

    loading.value = false
  },
  { immediate: true },
)
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
  width: 100%; /* ขยายตารางให้เต็มความกว้างคอนเทนเนอร์ */
  max-width: 100%; /* กำหนดให้ไม่เกินความกว้างของหน้าจอ */
  margin: 0 auto; /* จัดตารางให้อยู่กลางหน้าจอ */
  font-size: 18px;
  border-collapse: collapse; /* รวมเส้นขอบตาราง */
  overflow-x: auto;
  table-layout: auto; /* ช่วยให้ตารางขยายได้ตามขนาดข้อมูล */
}

th,
td {
  padding: 16px;
  text-align: left;
  width: 16%; /* ปรับความกว้างให้แต่ละคอลัมน์สมดุล */
}

th {
  font-weight: bold;
  font-size: 20px;
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

.active-tab {
  background-color: #d1bb9e !important; /* เปลี่ยนสีพื้นหลัง */
  border: 2px solid #a79277 !important; /* เพิ่มกรอบ */
  border-radius: 8px; /* ทำให้มุมมน */
  color: #503c3c !important; /* เปลี่ยนสีตัวอักษร */
  margin: 0 8px;
}

.inactive-tab {
  background-color: #c2c2c2 !important; /* สีพื้นหลังของแท็บที่ยังไม่ถูกเลือก */
  border: 2px solid #d3d3d3 !important; /* กรอบสีเทา */
  border-radius: 8px; /* มุมมน */
  color: #888 !important; /* สีตัวอักษรที่ดูจางลง */
  margin: 0 8px;
}

.text-warning {
  color: #edbb28 !important; /* สีเหลือง */
}

.text-success {
  color: #188131 !important; /* สีเขียว */
}

.text-error {
  color: #b11f2e !important; /* สีแดง */
}
</style>
