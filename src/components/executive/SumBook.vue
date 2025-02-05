<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/sumbook.png" alt="Library Image" />
        <h1>สรุปการซื้อหนังสือ</h1>

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
              @change="onSearch"
            ></v-select>
          </div>
        </v-col>

        <v-col cols="auto" class="ml-auto d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">สถานะ:</h3>
          <div>
            <v-select
              :items="['ทั้งหมด', 'มีคูปอง', 'ไม่มีคูปอง']"
              v-model="searchCoupon"
              class="select-coupon"
              variant="outlined"
              rounded="lg"
              @change="onSearch"
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
        :items-per-page="-1"
      >
      </v-data-table>

      <v-divider></v-divider>

      <!-- รวมข้อมูล -->
      <v-row class="mt-4">
        <v-col cols="6" class="text-start" style="font-weight: bold;">
          รวม: <b>{{ total.price }}</b> บาท
        </v-col>
        <v-col cols="6" class="text-end" style="font-weight: bold;">
          จำนวน: <b>{{ total.quantity }}</b> เล่ม
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

// วันที่
const selectedDate = ref(new Date())
const menuDate = ref(false)
const loading = ref(false)
const allItems = ref([]) // ข้อมูลต้นฉบับ
const serverItems = ref([]) // ข้อมูลที่จะแสดงในตาราง
const searchFaculty = ref('ทั้งหมด')
const searchCoupon = ref('ทั้งหมด')
const total = ref({
  price: 0,
  quantity: 0,
})

// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ข้อมูลหนังสือ', key: 'title' },
  { title: 'ISBN', key: 'isbn' },
  { title: 'ร้านค้า', key: 'shop' },
  { title: 'ราคาสุทธิ', key: 'price' },
  { title: 'จำนวน', key: 'quantity' },
  { title: 'สถานะ', key: 'status' },
  { title: 'คณะ', key: 'faculty' },
]

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
            faculty: 'วิทยาการสารสนเทศ',
            title: 'ความรู้สึกของเราสำคัญที่สุด',
            isbn: '9786161857707',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 1,
            status: 'มีคูปอง',
            date: '24/01/2568',
          },
          {
            id: 2,
            faculty: 'วิทยาการสารสนเทศ',
            title: 'วิทยาศาสตร์ขอวิทยาศาสตร์ของการใช้ชีวิต = The science of livingงการใช้ชีวิต',
            isbn: '9786162875434',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 1,
            status: 'ไม่มีคูปอง',
            date: '24/01/2568',
          },
          {
            id: 3,
            faculty: 'บริหาร',
            title: 'คุณคางคกไปพบนักจิตบำบัด : การผจญภัยทางจิตวิทยา = Counselling for toads : a psychological adventure',
            isbn: '9786160459049',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 2,
            status: 'มีคูปอง',
            date: '24/01/2568',
          },
          {
            id: 4,
            faculty: 'บริหาร',
            title: 'ร่างกายไม่เคยโกหก = What every body is saying',
            isbn: '9786162875687',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 2,
            status: 'มีคูปอง',
            date: '24/12/2567',
          },
          {
            id: 5,
            faculty: 'วิทยาศาสตร์',
            title: 'ภาวะลื่นไหล ทำอะไรก็ง่ายหมด = Productivity flow',
            isbn: '9786169373964',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 2,
            status: 'มีคูปอง',
            date: '09/01/2568',
          },
          {
            id: 6,
            faculty: 'วิทยาศาสตร์',
            title: 'หัวไม่ดีก็มีวิธีสอบผ่าน',
            isbn: '9786165786195',
            shop: 'ร้านนี้ดี',
            price: 250,
            quantity: 2,
            status: 'มีคูปอง',
            date: '09/01/2568',
          },
        ]
        resolve(data)
      }, 500)
    })
  },
}

// ฟังก์ชันกรองข้อมูล
const onSearch = async () => {
  loading.value = true
  const items = await FakeAPI.fetch()

  let filteredItems = items.filter((item) => {
    const matchesDate = !selectedDate.value || item.date === formattedDate.value
    const matchesFaculty = searchFaculty.value === 'ทั้งหมด' || item.faculty === searchFaculty.value
    const matchesCoupon = searchCoupon.value === 'ทั้งหมด' || item.status === searchCoupon.value
    return matchesDate && matchesFaculty && matchesCoupon
  })

  total.value.price = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  total.value.quantity = filteredItems.reduce((sum, item) => sum + item.quantity, 0)
  serverItems.value = filteredItems
  loading.value = false
  menuDate.value = false
}

onMounted(() => {
  const today = new Date()
  selectedDate.value = today
  onSearch() // เรียกฟังก์ชันค้นหาทันทีเมื่อเริ่มต้น
})

watch([selectedDate, searchFaculty, searchCoupon], onSearch)
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

.custom-date-picker {
  font-size: 20px;
  white-space: nowrap;
  overflow: visible;
  text-overflow: unset;
  width: 100px;
  min-width: 200px;
  text-align: center;
  justify-content: center;
  align-content: center;
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

.select-faculty {
  width: 400px;
}

.select-coupon {
  width: 250px;
}

.table {
  margin-top: 20px;
  font-size: 16px;
}
</style>
