<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container fluid>
      <div class="header">
        <img class="header-image" src="@/assets/salary (1).png" alt="Library Image" />
        <h1>สรุปงบประมาณ</h1>
      </div>

      <v-row align="center" justify="space-between">
        <!-- คณะ -->
        <v-col cols="auto" class="d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">คณะ:</h3>
          <v-select
            :items="faculties"
            v-model="searchFaculty"
            class="select-book"
            variant="outlined"
            rounded="lg"
            multiple
            chips
            closable-chips
            @update:modelValue="onSearch"
          />
        </v-col>

        <!-- วันที่ (อยู่ขวาสุด) -->
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
        class="table-centered"
        :items-per-page="10"
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
import axios from 'axios'

// วันที่
const selectedDate = ref(new Date())
const menuDate = ref(false)
const searchFaculty = ref<string[]>(['ทั้งหมด'])
const loading = ref(false)
const serverItems = ref([])
const router = useRouter()
const facultyList = ref<string[]>(['ทั้งหมด'])
const faculties = ref<string[]>(['ทั้งหมด'])

// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'คณะ', key: 'faculty' },
  { title: 'งบประมาณที่ให้', key: 'e_coupon' },
  { title: 'งบประมาณที่ใช้', key: 'usebudget' },
  { title: 'คงเหลือ', key: 'remain' },
  { title: 'รายละเอียด', key: 'description', align: 'center' },
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

// API ปลอมเพื่อเลียนแบบการดึงข้อมูล
// const FakeAPI = {
//   async fetch({
//     faculty,
//     name,
//   }: {
//     page: number
//     itemsPerPage: number
//     faculty?: string
//     name?: string
//   }) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         let data = [
//           {
//             id: 1,
//             faculty: 'วิทยาการสารสนเทศ',
//             budget: '200,000',
//             usebudget: '158,700',
//             remain: '41,300',
//             date: '04/03/2568',
//           },
//           {
//             id: 2,
//             faculty: 'วิทยาศาสตร์',
//             budget: '200,000',
//             usebudget: '158,700',
//             remain: '41,300',
//             date: '04/03/2568',
//           },
//           {
//             id: 3,
//             faculty: 'บริหาร',
//             budget: '200,000',
//             usebudget: '158,700',
//             remain: '41,300',
//             date: '04/03/2568',
//           },
//           {
//             id: 4,
//             faculty: 'วิศวกรรมศาสตร์',
//             budget: '200,000',
//             usebudget: '158,700',
//             remain: '41,300',
//             date: '04/03/2568',
//           },
//           {
//             id: 5,
//             faculty: 'เภสัชศาสตร์',
//             budget: '200,000',
//             usebudget: '158,700',
//             remain: '41,300',
//             date: '04/03/2568',
//           },
//           {
//             id: 6,
//             faculty: 'ครุศาสตร์',
//             budget: '200,000',
//             usebudget: '158,700',
//             remain: '41,300',
//             date: '04/03/2568',
//           },
//         ]

//         // กรองข้อมูลใน API
//         if (faculty && faculty !== 'ทั้งหมด') {
//           data = data.filter((item) => item.faculty === faculty)
//         }

//         if (name) {
//           const lowerName = name.toLowerCase()
//           data = data.filter((item) => item.name.toLowerCase().includes(lowerName))
//         }
//         resolve(data)
//       }, 500)
//     })
//   },
// }

const onSearch = () => {
  loading.value = true

  FakeAPI.fetch({ page: 1, itemsPerPage: 10 }).then((items: any[]) => {
    let filteredItems = items

    // ฟอร์แมตวันที่ให้ตรงกับข้อมูลใน API
    const selectedFormattedDate = formattedDate.value

    if (selectedDate.value && selectedFormattedDate) {
      // แปลงปี ค.ศ. เป็น พ.ศ. ก่อนกรอง
      filteredItems = filteredItems.filter((item) => {
        const itemDateParts = item.date.split('/') // แยกวันที่ใน API เช่น "04/03/2568"
        const itemYear = parseInt(itemDateParts[2], 10) // ดึงปีจากข้อมูล
        const expectedYear = new Date(selectedDate.value).getFullYear() + 543 // แปลงปีที่เลือกเป็น พ.ศ.

        return (
          itemDateParts[0] === selectedFormattedDate.split('/')[0] &&
          itemDateParts[1] === selectedFormattedDate.split('/')[1] &&
          itemYear === expectedYear
        )
      })
    }

    // กรองข้อมูลตามคณะที่เลือก (รองรับหลายคณะ)
    if (searchFaculty.value.length > 0 && !searchFaculty.value.includes('ทั้งหมด')) {
      filteredItems = filteredItems.filter((item) => searchFaculty.value.includes(item.faculty))
    }

    // หากไม่มีการกรองเพิ่มเติมและไม่มีวันที่ที่เลือก ให้แสดงข้อมูลทั้งหมด
    if (
      !selectedDate.value &&
      (searchFaculty.value.length === 0 || searchFaculty.value.includes('ทั้งหมด'))
    ) {
      filteredItems = items
    }

    // อัปเดตข้อมูลในตาราง
    serverItems.value = filteredItems

    // แจ้งเตือนถ้าไม่มีข้อมูลตรงกับเงื่อนไข
    if (filteredItems.length === 0) {
      console.warn('ไม่พบข้อมูลที่ตรงกับเงื่อนไขที่เลือก')
    }

    loading.value = false
    menuDate.value = false
  })
}

// ฟังก์ชันดึงข้อมูลจาก API
const fetchFaculties = async () => {
  try {
    const response = await axios.get('http://bookfair.buu.in.th:8043/faculties')
    const facultiesData = response.data
    faculties.value = ['ทั้งหมด', ...facultiesData.map((faculty: any) => faculty.faculty_name)]
  } catch (error) {
    console.error('Error fetching faculties:', error)
  }
}

const fetchBudgetData = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://bookfair.buu.in.th:8043/faculties')
    const faculties = response.data

    let filteredItems = faculties.map((fac, index) => ({
      id: index + 1,
      faculty: fac.faculty_name,
      e_coupon: fac.e_coupon,
      usebudget: '0',
      remain: '0',
    }))

    // กรองข้อมูลตามคณะที่เลือก
    if (searchFaculty.value.length > 0 && !searchFaculty.value.includes('ทั้งหมด')) {
      filteredItems = filteredItems.filter((item) => searchFaculty.value.includes(item.faculty))
    }

    serverItems.value = filteredItems
  } catch (error) {
    console.error('Error fetching budget data:', error)
  }

  loading.value = false
}

const onClickBook = (item) => {
  if (item && item.id) {
    router.push({ name: 'showBudgetAdmin', params: { itemId: item.id } })
  } else {
    console.error('Item or item.id is undefined')
  }
}

// โหลดข้อมูลครั้งแรก
onMounted(() => {
  fetchFaculties()
  fetchBudgetData()
})

// อัปเดตข้อมูลเมื่อเปลี่ยนค่า
watch([searchFaculty, selectedDate], () => {
  fetchBudgetData()
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
