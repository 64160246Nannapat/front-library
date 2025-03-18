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

              <v-date-picker
                v-model="selectedDate"
                @update:modelValue="menuDate = false"
                locale="th"
              />
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

        <!-- เลือกประเภท -->
        <v-col cols="12" md="6" lg="4" class="ml-auto d-flex justify-end align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">ประเภท:</h3>
          <v-select
            :items="['เสนอหนังสือทั่วไป', 'เสนอหนังสืองานหนังสือ']"
            v-model="selectedCategory"
            class="select-book"
            variant="outlined"
            rounded="lg"
            @update:modelValue="onSearch"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Data Table -->
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="computedHeaders"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        @update:options="loadItems"
        show-items-per-page="false"
        :hide-default-footer="true"
      >
        <!-- ตำแหน่งการแสดงข้อมูล -->
        <template v-slot:item.rowIndex="{ item }">
          <span>{{ item.rowIndex }}</span>
        </template>
        <template v-slot:item.book_title="{ item }">
          <span>{{ item.book_title }}</span>
        </template>
        <template v-slot:item.book_author="{ item }">
          <span>{{ item.book_author }}</span>
        </template>
        <template v-slot:item.ISBN="{ item }">
          <span>{{ item.ISBN }}</span>
        </template>
        <template v-slot:item.price="{ item }">
          <span>{{ item.price }}</span>
        </template>
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
  created_at?: string
  user_id?: string
}

const selectedCategory = ref('เสนอหนังสือทั่วไป')
const selectedDate = ref(new Date())
const menuDate = ref(false)
const itemsPerPage = ref(10)
const loading = ref(false)
const totalItems = ref(0)
const serverItems = ref<BookItem[]>([])
const selectedTab = ref('กำลังดำเนินการ')
const token = localStorage.getItem('token')
const loggedInUserId = ref(getUserIdFromToken(token))

console.log('🔹 Token:', token)
console.log('🔹 User ID from Token:', loggedInUserId.value)

const computedHeaders = computed(() => {
  return selectedCategory.value === 'เสนอหนังสือทั่วไป' ? headerOnl : headerOfl
}) //ฟังก์ชั่นเปลี่ยนตารางตามประเภท

const headerOnl = [
  { title: 'ลำดับ', key: 'rowIndex', width: '50px', align: 'start' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '200px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '100px' },
  { title: 'ISBN', key: 'ISBN', width: '100px' },
  { title: 'ราคา', key: 'price', width: '100px' },
  //{ title: 'รายละเอียด', key: 'form_description', width: '150px' },
  { title: 'สถานะ', key: 'form_status', width: '150px' },
]

const headerOfl = [
  { title: 'ลำดับ', key: 'rowIndex', width: '50px', align: 'start' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '200px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '100px' },
  { title: 'ISBN', key: 'ISBN', width: '100px' },
  { title: 'ราคา', key: 'price', width: '100px' },
  { title: 'ร้านค้า', key: 'store', width: '100px' },
  { title: 'รูปภาพ', key: 'image', width: '100px' },
  //{ title: 'รายละเอียด', key: 'form_description', width: '150px' },
  { title: 'สถานะ', key: 'form_status', width: '150px' },
]

const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = selectedDate.value
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear() + 543}`
})

const fullFormattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = selectedDate.value
  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์']
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
  return `วัน${days[date.getDay()]} ที่ ${date.getDate()} ${months[date.getMonth()]} พ.ศ. ${date.getFullYear() + 543}`
})

function getUserIdFromToken(token: string | null) {
  if (!token) return null
  try {
    const base64Payload = token.split('.')[1]
    const decodedPayload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(decodedPayload)
    console.log('🔸 Decoded Token:', payload) // ลองดูข้อมูลทั้งหมด
    return payload.sub || payload.user_id || null
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

const fetchUserData = async () => {
  if (!token) return

  try {
    const response = await axios.get('URL_API_ดึงข้อมูลผู้ใช้', {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log('📌 User Data:', response.data)
    if (response.data && response.data.user_id) {
      loggedInUserId.value = response.data.user_id
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

fetchUserData()

const loadItems = async () => {
  loading.value = true
  try {
    const urls = [
      { url: 'http://bookfair.buu.in.th:8043/offer-forms-onl', category: 'เสนอหนังสือทั่วไป' },
      { url: 'http://bookfair.buu.in.th:8043/offer-forms-ofl', category: 'เสนอหนังสืองานหนังสือ' },
    ]

    const responses = await Promise.all(urls.map(({ url }) => axios.get(url)))

    const rawItems = responses.flatMap((response, index) => {
      const data = Array.isArray(response.data) ? response.data : []
      return data.map((item) => ({
        offer_form_id: item.offerForms_onl_id || item.offerForms_ofl_id || '-',
        ISBN: item.ISBN?.trim() || '-',
        book_title: item.book_title || '-',
        book_author: item.book_author || '-',
        price: item.price ?? '-',
        form_status: item.status || '-',
        createdAt: item.createdAt || '',
        user_id: item.user_id ?? item.user?.id ?? null,
        book_category: urls[index].category,
      }))
    })

    console.log('✅ Raw Data:', rawItems)

    serverItems.value = filterDataByDateAndStatus(rawItems)

    console.log('🎯 Processed Data:', serverItems.value)
    totalItems.value = serverItems.value.length // อัปเดตจำนวนรายการทั้งหมด
  } catch (error) {
    console.error('🚨 ดึงข้อมูลล้มเหลว:', error)
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'กำลังดำเนินการ':
      return 'status-pending'
    case 'อนุมัติการซื้อ':
      return 'status-approved'
    case 'ไม่อนุมัติการซื้อ':
      return 'status-rejected'
    default:
      return ''
  }
}

// ฟังก์ชันกรองข้อมูลตามวันที่, สถานะ และประเภท
const filterDataByDateAndStatus = (data: BookItem[]) => {
  if (!loggedInUserId.value) return [] // ถ้าไม่มี user_id ของผู้ใช้งานที่ล็อกอิน ไม่แสดงข้อมูล

  const selectedDateString = selectedDate.value.toLocaleDateString('th-TH') // เปลี่ยนจาก toISOString มาเป็น toLocaleDateString

  return data
    .filter((item) => {
      if (!item.createdAt) return false
      const createdAtDate = new Date(item.createdAt)
      const createdAtString = createdAtDate.toLocaleDateString('th-TH') // เปลี่ยนจาก toISOString มาเป็น toLocaleDateString
      return createdAtString === selectedDateString
    })
    .filter((item) => item.form_status?.trim() === selectedTab.value?.trim())
    .filter((item) => item.book_category === selectedCategory.value)
    .filter((item) => {
      // ตรวจสอบว่ามีการกรองข้อมูลตาม user_id
      if (item.user_id === null) {
        return true // แสดงข้อมูลที่ไม่มี user_id หรือกรณีที่ user_id เป็น null
      }
      return String(item.user_id) === String(loggedInUserId.value) // กรองข้อมูลตาม user_id ของผู้ใช้งานที่ล็อกอิน
    })
    .map((item, index) => ({
      ...item,
      rowIndex: index + 1,
    }))
}

watch(loggedInUserId, (newVal) => {
  if (newVal) {
    console.log('🚀 User ID เปลี่ยน โหลดข้อมูลใหม่:', newVal)
    loadItems()
  }
})

watch(
  [selectedDate, selectedTab, selectedCategory, loggedInUserId],
  () => {
    if (loggedInUserId.value) {
      loadItems()
    }
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

.select-book {
  max-width: 350px;
}

.status-pending {
  color: #ff9800; /* สีเหลือง */
  font-weight: bold;
}

.status-approved {
  color: #4caf50; /* สีเขียว */
  font-weight: bold;
}

.status-rejected {
  color: #f44336; /* สีแดง */
  font-weight: bold;
}
</style>
