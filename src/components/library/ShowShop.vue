<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/store (2).png" alt="Library Image" />
        <h1>ร้านค้า</h1>
      </div>

      <v-row>
        <v-col cols="auto">
          <div class="formatted-date-display">
            <h2>{{ fullFormattedDate }}</h2>
          </div>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col cols="auto" class="d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">ร้านค้า:</h3>
          <div>
            <v-select
              :items="['ทั้งหมด', 'แจ่มใส', 'นายอินทร์', 'Book & Print', 'KP Book']"
              v-model="searchShop"
              class="select-faculty"
              variant="outlined"
              rounded="lg"
            ></v-select>
          </div>
        </v-col>

        <v-col cols="auto" class="ml-auto d-flex align-center" style="margin-top: -25px">
          <v-menu v-model="menuDate" :close-on-content-click="false" transition="scale-transition">
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

            <v-date-picker v-model="selectedDate" @input="menuDate = false" locale="th" />
          </v-menu>
        </v-col>
      </v-row>

      <!-- ตารางข้อมูล -->
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
import { ref, computed, watch, onMounted } from 'vue'

// วันที่
const selectedDate = ref(new Date())
const menuDate = ref(false)
const loading = ref(false)
const serverItems = ref([])
const searchShop = ref('ทั้งหมด')
const total = ref({
  price: 0,
  quantity: 0,
})

// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ชื่อหนังสือ', key: 'title' },
  { title: 'ISBN', key: 'isbn' },
  { title: 'ร้านค้า', key: 'shop' },
  { title: 'จำนวน', key: 'quantity' },
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
  async fetch() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          {
            id: 1,
            title: 'ความรู้สึกของเราสำคัญที่สุด',
            isbn: 9786161857707,
            shop: 'KP Book',
            quantity: 1,
            price: 250,
            date: '20/12/2567',
          },
          {
            id: 2,
            title: 'วิทยาศาสตร์ของการใช้ชีวิต = The science of living',
            isbn: 9786162875434,
            shop: 'KP Book',
            quantity: 1,
            price: 250,
            date: '20/12/2567',
          },
          {
            id: 3,
            title: 'คุณคางคกไปพบนักจิตบำบัด',
            isbn: 9786160459049,
            shop: 'แจ่มใส',
            quantity: 1,
            price: 250,
            date: '25/12/2567',
          },
          {
            id: 4,
            title: 'ร่างกายไม่เคยโกหก = What every body is saying',
            isbn: 9786162875687,
            shop: 'นายอินทร์',
            quantity: 1,
            price: 250,
            date: '25/12/2567',
          },
          {
            id: 5,
            title: 'ภาวะลื่นไหล ทำอะไรก็ง่ายหมด = Productivity flow',
            isbn: 9786169373964,
            shop: 'Book & Print',
            quantity: 1,
            price: 250,
            date: '25/12/2567',
          },
        ]
        resolve(data)
      }, 500)
    })
  },
}

// ฟังก์ชันโหลดข้อมูล
const loadItems = () => {
  loading.value = true
  FakeAPI.fetch()
    .then((items: any[]) => {
      let filteredItems = items

      // กรองตามวันที่
      if (formattedDate.value) {
        filteredItems = filteredItems.filter((item) => item.date === formattedDate.value)
      }

      // กรองตามร้านค้า
      if (searchShop.value !== 'ทั้งหมด') {
        filteredItems = filteredItems.filter((item) => item.shop === searchShop.value)
      }

      serverItems.value = filteredItems
      total.value = filteredItems.reduce(
        (acc, item) => {
          acc.price += item.price * item.quantity
          acc.quantity += item.quantity
          return acc
        },
        { price: 0, quantity: 0 },
      )
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  const today = new Date()
  selectedDate.value = today
  loadItems() // เรียกฟังก์ชันค้นหาทันทีเมื่อเริ่มต้น
})

// เฝ้าดูการเปลี่ยนแปลงตัวกรอง
watch([selectedDate, searchShop], loadItems)

// โหลดข้อมูลครั้งแรก
loadItems()
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-image {
  width: 65px;
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

.select-faculty {
  width: 500px;
}

.select-coupon {
  width: 200px;
}
</style>
