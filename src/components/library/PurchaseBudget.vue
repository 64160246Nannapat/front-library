<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/sumbook.png" alt="Library Image" />
        <h1>ประเมินงบการสั่งซื้อหนังสือ</h1>

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

      <v-row align="center">
        <v-col cols="auto" class="d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">คณะ:</h3>
          <div>
            <v-select
              :items="['ทั้งหมด', 'วิทยาการสารสนเทศ', 'วิศวกรรมศาสตร์', 'วิทยาศาสตร์', 'บริหาร']"
              v-model="searchFaculty"
              class="select-faculty"
              variant="outlined"
              rounded="lg"
            ></v-select>
          </div>
        </v-col>

        <v-col cols="auto" class="ml-auto d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">ประเภท:</h3>
          <div>
            <v-select
              :items="['ทั้งหมด', 'มีคูปอง', 'ไม่มีคูปอง']"
              v-model="searchCoupon"
              class="select-coupon"
              variant="outlined"
              rounded="lg"
            ></v-select>
          </div>
        </v-col>
      </v-row>

      <!-- ตารางข้อมูล -->
      <v-data-table
        :headers="headers"
        :items="serverItems"
        :loading="loading"
        item-key="id"
        :hide-default-footer="true"
        class="table"
      >
      </v-data-table>

      <v-divider></v-divider>

      <!-- รวมข้อมูล -->
      <v-row class="d-flex justify-space-between mt-3">
        <v-col class="text-right">
          <h4 style="margin-right: 530px">รวม</h4>
        </v-col>
        <v-col class="text-left">
          <p style="margin-left: 235px">{{ total.price }}</p>
          <p style="margin-left: 375px; margin-top: -23px">{{ total.quantity }}</p>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// วันที่
const selectedDate = ref(new Date())
const menuDate = ref(false)
const loading = ref(false)
const serverItems = ref([])
const searchCategory = ref('ISBN')
const searchFaculty = ref('ทั้งหมด')
const searchCoupon = ref('ทั้งหมด')
const total = ref({
  price: 0,
  quantity: 0,
})
// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ข้อมูลผู้คัดเลือก', key: 'name' },
  { title: 'ตำแหน่ง', key: 'position' },
  { title: 'คณะ', key: 'faculty' },
  { title: 'ชื่อหนังสือ', key: 'title' },
  { title: 'ร้านค้า', key: 'shop' },
  { title: 'ราคาสุทธิ', key: 'price' },
  { title: 'จำนวน', key: 'quantity' },
  { title: 'สถานะ', key: 'status' },
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
            position: 'อาจารย์',
            faculty: 'วิทยาการสารสนเทศ',
            title: 'ความรู้สึกของเราสำคัญที่สุด',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 1,
            status: 'มีคูปอง',
            date: '02/12/2567',
          },
          {
            id: 2,
            name: 'นันท์ณภัทร สอนสุภาพ',
            position: 'อาจารย์',
            faculty: 'วิทยาการสารสนเทศ',
            title: 'วิทยาศาสตร์ของการใช้ชีวิต = The science of living',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 1,
            status: 'ไม่มีคูปอง',
            date: '02/12/2567',
          },
          {
            id: 3,
            name: 'นวพรรณ สีหบุตร',
            position: 'นิสิต',
            faculty: 'วิทยาการสารสนเทศ',
            title: 'คุณคางคกไปพบนักจิตบำบัด : การผจญภัยทางจิตวิทยา = Counselling for toads',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 1,
            status: 'ไม่มีคูปอง',
            date: '24/12/2567',
          },
          {
            id: 4,
            name: 'นันท์ณภัทร สอนสุภาพ',
            position: 'อาจารย์',
            faculty: 'บริหาร',
            title: 'ร่างกายไม่เคยโกหก = What every body is saying',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 1,
            status: 'มีคูปอง',
            date: '24/12/2567',
          },
          {
            id: 5,
            name: 'นันท์ณภัทร สอนสุภาพ',
            position: 'อาจารย์',
            faculty: 'บริหาร',
            title: 'ภาวะลื่นไหล ทำอะไรก็ง่ายหมด = Productivity flow',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 2,
            status: 'มีคูปอง',
            date: '24/12/2567',
          },
        ]

        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage

        resolve({
          items: data.slice(start, end),
          total: data.length,
        })
      }, 500)
    })
  },
}

const loadItems = ({ page, itemsPerPage }) => {
  loading.value = true

  FakeAPI.fetch({ page, itemsPerPage })
    .then(({ items }) => {
      // เริ่มต้นการกรองด้วยข้อมูลทั้งหมด
      let filteredItems = items

      // กรองตามวันที่
      if (selectedDate.value) {
        const selectedFormattedDate = formattedDate.value
        filteredItems = filteredItems.filter((item) => {
          return item.date.trim() === selectedFormattedDate.trim()
        })
      }

      // กรองตามคณะ
      if (searchFaculty.value !== 'ทั้งหมด') {
        filteredItems = filteredItems.filter((item) => {
          return item.faculty === searchFaculty.value
        })
      }

      // กรองตามประเภทคูปอง
      if (searchCoupon.value !== 'ทั้งหมด') {
        filteredItems = filteredItems.filter((item) => {
          return item.status === searchCoupon.value
        })
      }

      // อัปเดตข้อมูลที่กรองแล้วในตาราง
      serverItems.value = filteredItems

      // คำนวณราคาและจำนวนรวมของรายการที่กรองแล้ว
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

watch([selectedDate, searchFaculty, searchCoupon], () => {
  loadItems({ page: 1, itemsPerPage: 10 })
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

.select-faculty {
  width: 500px;
}

.select-coupon {
  width: 200px;
}

.table {
  border-bottom: 1px solid #4e484a;
}
</style>
