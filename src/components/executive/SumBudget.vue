<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container fluid>
      <div class="header">
        <img class="header-image" src="@/assets/salary (1).png" alt="Library Image" />
        <h1>สรุปงบประมาณ</h1>
      </div>

      <v-row align="center">
        <v-col cols="auto" class="d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">คณะ:</h3>
          <v-select
            :items="['ทั้งหมด', 'วิทยาการสารสนเทศ', 'บริหาร', 'วิทยาศาสตร์', 'วิศวกรรมศาสตร์']"
            v-model="searchFaculty"
            class="select-book"
            multiple
            chips
            variant="outlined"
            rounded="lg"
            @update:modelValue="onSearch"
          ></v-select>
        </v-col>

        <!-- ใช้ v-spacer ดัน v-col ด้านขวา -->
        <v-spacer></v-spacer>

        <v-col cols="auto" class="date-status-row">
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

            <v-date-picker v-model="selectedDate" locale="th" @input="onSearch" />
          </v-menu>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="serverItems"
        :loading="loading"
        item-key="id"
        :hide-default-footer="true"
        class="table-centered"
        :items-per-page="-1"
      >
        <!-- Slot สำหรับคอลัมน์ "จำนวน" -->
        <template #item.description="{ item }">
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              flex-direction: column;
            "
          >
            <v-btn
              style="
                background-color: #eed3d9;
                width: 100px;
                height: 25px;
                font-size: 14px;
                line-height: 1;
                margin-top: 8px;
              "
              @click="onClickBook(item)"
            >
              รายละเอียด
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// วันที่
const selectedDate = ref(new Date())
const menuDate = ref(false)
const searchFaculty = ref<string[]>(['ทั้งหมด'])
const loading = ref(false)
const serverItems = ref([])
const router = useRouter()
// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'คณะ', key: 'faculty' },
  { title: 'งบประมาณที่ให้', key: 'budget' },
  { title: 'งบประมาณที่ใช้', key: 'usebudget' },
  { title: 'คงเหลือ', key: 'remain' },
  { title: 'รายละเอียด', key: 'description' },
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

// const fullFormattedDate = computed(() => {
//   if (!selectedDate.value) return ''
//   const date = new Date(selectedDate.value)

//   const days = [
//     'วันอาทิตย์',
//     'วันจันทร์',
//     'วันอังคาร',
//     'วันพุธ',
//     'วันพฤหัสบดี',
//     'วันศุกร์',
//     'วันเสาร์',
//   ]
//   const months = [
//     'มกราคม',
//     'กุมภาพันธ์',
//     'มีนาคม',
//     'เมษายน',
//     'พฤษภาคม',
//     'มิถุนายน',
//     'กรกฎาคม',
//     'สิงหาคม',
//     'กันยายน',
//     'ตุลาคม',
//     'พฤศจิกายน',
//     'ธันวาคม',
//   ]

//   const dayName = days[date.getDay()]
//   const day = date.getDate()
//   const monthName = months[date.getMonth()]
//   const year = date.getFullYear() + 543

//   return `${dayName} ที่ ${day} ${monthName} พ.ศ. ${year}`
// })

const FakeAPI = {
  async fetch({ faculty }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = [
          {
            id: 1,
            faculty: 'วิทยาการสารสนเทศ',
            budget: '200,000',
            usebudget: '158,700',
            remain: '41,300',
            date: '06/02/2568',
          },
          {
            id: 2,
            faculty: 'วิทยาศาสตร์',
            budget: '200,000',
            usebudget: '158,700',
            remain: '41,300',
            date: '06/02/2568',
          },
          {
            id: 3,
            faculty: 'บริหาร',
            budget: '200,000',
            usebudget: '158,700',
            remain: '41,300',
            date: '06/02/2568',
          },
          {
            id: 4,
            faculty: 'วิศวกรรมศาสตร์',
            budget: '200,000',
            usebudget: '158,700',
            remain: '41,300',
            date: '06/02/2568',
          },
          {
            id: 5,
            faculty: 'เภสัชศาสตร์',
            budget: '200,000',
            usebudget: '158,700',
            remain: '41,300',
            date: '06/02/2568',
          },
          {
            id: 6,
            faculty: 'ครุศาสตร์',
            budget: '200,000',
            usebudget: '158,700',
            remain: '41,300',
            date: '06/02/2568',
          },
        ]

        // กรองข้อมูลถ้าเลือกคณะ (ไม่ใช่ "ทั้งหมด")
        if (!faculty.includes('ทั้งหมด')) {
          data = data.filter((item) => faculty.some((f) => item.faculty === f))
        }

        resolve(data)
      }, 500)
    })
  },
}

const onSearch = () => {
  loading.value = true

  // กรองข้อมูลจาก API
  FakeAPI.fetch({ faculty: searchFaculty.value }).then((items: any[]) => {
    let filteredItems = items

    // ฟอร์แมตวันที่ที่เลือก
    const selectedFormattedDate = formattedDate.value

    // กรองข้อมูลตามวันที่
    if (selectedDate.value && selectedFormattedDate) {
      filteredItems = filteredItems.filter((item) => item.date === selectedFormattedDate)
    }

    // กรองข้อมูลตามคณะที่เลือก
    if (!searchFaculty.value.includes('ทั้งหมด')) {
      filteredItems = filteredItems.filter((item) => searchFaculty.value.includes(item.faculty))
    }

    // อัปเดตข้อมูลในตาราง
    serverItems.value = filteredItems

    // แจ้งเตือนถ้าไม่มีข้อมูลที่ตรงกับเงื่อนไข
    if (filteredItems.length === 0) {
      console.warn('ไม่พบข้อมูลที่ตรงกับเงื่อนไขที่เลือก')
    }

    loading.value = false
    menuDate.value = false
  })
}

const fetchData = async () => {
  loading.value = true
  serverItems.value = await FakeAPI.fetch({ faculty: searchFaculty.value })
  loading.value = false
}

const onClickBook = (item) => {
  if (item && item.id) {
    router.push({ name: 'showBudgetExecutive', params: { itemId: item.id } })
  } else {
    console.error('Item or item.id is undefined')
  }
}

// ติดตามการเปลี่ยนแปลงของ searchFaculty และโหลดข้อมูลใหม่
watch(searchFaculty, fetchData, { deep: true })

// โหลดข้อมูลทั้งหมดเมื่อเปิดหน้าเว็บ
onMounted(fetchData)
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
  width: 300px;
}

.custom-isbn {
  width: 80px;
  height: 56px;
  line-height: 56px;
}

.select-book {
  width: 400px;
}
</style>
