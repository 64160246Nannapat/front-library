<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container fluid>
      <div class="header">
        <img class="header-image" src="@/assets/history-coupon (1).png" alt="Library Image" />
        <h1>ประวัติการใช้คูปอง</h1>

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

              <v-date-picker v-model="selectedDate" locale="th" @input="onSearch" />
            </v-menu>
          </v-col>
        </v-row>
      </div>

      <!-- แสดงวันที่ฟอร์แมต -->
      <v-row>
        <v-col cols="auto">
          <div class="formatted-date-display">
            <h2>{{ fullFormattedDate }}</h2>
          </div>
        </v-col>
      </v-row>

      <!-- ตารางข้อมูล -->
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        @update:options="onSearch"
        :hide-default-footer="true"
      >
      </v-data-table>

      <v-divider></v-divider>

      <!-- รวมข้อมูล -->
      <v-row class="mt-4">
        <v-col cols="6" class="text-start" style="font-weight: bold">
          รวม: <b>{{ total.price }}</b> บาท
        </v-col>
        <v-col cols="6" class="text-end" style="font-weight: bold">
          จำนวน: <b>{{ total.quantity }}</b> เล่ม
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// วันที่
const selectedDate = ref(new Date())
const menuDate = ref(false)
const itemsPerPage = ref(1000000)
const loading = ref(false)
const totalItems = ref(0)
const serverItems = ref([])
// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ชื่อหนังสือ', key: 'title' },
  { title: 'ISBN', key: 'isbn' },
  { title: 'ร้านค้า', key: 'shop' },
  { title: 'ราคาสุทธิ', key: 'price' },
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
  async fetch({ page, itemsPerPage }: { page: number; itemsPerPage: number }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          {
            id: 1,
            title: 'ความรู้สึกของเราสำคัญที่สุด',
            date: '14/03/2568',
            isbn: '9786161857707',
            shop: 'แจ่มใส',
            price: 250,
            quantity: 1,
          },
          {
            id: 2,
            title: 'วิทยาศาสตร์ของการใช้ชีวิต = The science of living',
            date: '14/03/2568',
            isbn: '9786162875434',
            shop: 'แจ่มใส',
            price: 350,
            quantity: 1,
          },
          {
            id: 3,
            title:
              'คุณคางคกไปพบนักจิตบำบัด : การผจญภัยทางจิตวิทยา = Counselling for toads : a psychological adventure',
            date: '14/03/2568',
            isbn: '9786160459049',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 1,
          },
          {
            id: 4,
            title: 'ร่างกายไม่เคยโกหก = What every body is saying',
            date: '14/03/2568',
            isbn: '9786162875687',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 1,
          },
          {
            id: 5,
            title: 'ภาวะลื่นไหล ทำอะไรก็ง่ายหมด = Productivity flow',
            date: '14/03/2568',
            isbn: '9786169373964',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 1,
          },
          {
            id: 6,
            title: 'หัวไม่ดีก็มีวิธีสอบผ่าน',
            date: '14/03/2568',
            isbn: '9786165786195',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 1,
          },
        ]

        resolve(data)
      }, 500)
    })
  },
}

const onSearch = () => {
  loading.value = true
  FakeAPI.fetch({ page: 1, itemsPerPage: 10 }).then((items) => {
    let filteredItems = items

    if (selectedDate.value) {
      const selectedFormattedDate = formattedDate.value
      filteredItems = filteredItems.filter((item) => item.date === selectedFormattedDate)
    }

    // หากไม่มีการกรองเพิ่มเติมและไม่มีวันที่ที่เลือก ให้แสดงข้อมูลทั้งหมด
    if (!selectedDate.value) {
      filteredItems = items
    }

    // อัปเดตข้อมูลตาราง
    serverItems.value = filteredItems
    totalItems.value = filteredItems.length // จำนวนรายการทั้งหมด

    // หากไม่มีข้อมูลให้เตือนใน console
    if (filteredItems.length === 0) {
      console.warn('No data found with the selected criteria.')
    }

    loading.value = false
    menuDate.value = false
  })
}

// คำนวณราคาและจำนวนหนังสือรวม
const total = computed(() => {
  const price = serverItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const quantity = serverItems.value.reduce((sum, item) => sum + item.quantity, 0)
  return {
    price, // รวมราคา
    quantity, // รวมจำนวน
  }
})

onMounted(() => {
  const today = new Date()
  selectedDate.value = today
  onSearch() // เรียกฟังก์ชันค้นหาทันทีเมื่อเริ่มต้น
})

watch([selectedDate], onSearch, { immediate: true })
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
</style>
