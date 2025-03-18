<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container fluid>
      <div class="header">
        <img class="header-image" src="@/assets/list.png" alt="Library Image" />
        <h1>รายชื่อผู้เสนอหนังสือ</h1>
      </div>

      <v-row align="center">
        <v-col cols="auto" class="d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">คณะ:</h3>
          <v-select
            :items="[
              'ทั้งหมด',
              'คณะดนตรีและการแสดง',
              'วิทยาการสารสนเทศ',
              'วิศวกรรมศาสตร์',
              'วิทยาศาสตร์',
              'บริหาร',
            ]"
            v-model="searchFaculty"
            class="select-faculty"
            variant="outlined"
            rounded="lg"
            multiple
            clearable
            @update:modelValue="onSearch"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip closable @click:close="removeItem(index)">
                {{ item.title }}
              </v-chip>
            </template>
          </v-select>
        </v-col>

        <v-col cols="auto" class="ml-auto d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">ชื่อ:</h3>
          <v-text-field
            v-model="searchText"
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
        <template #item.quantity="{ item }">
          <div
            style="
              display: flex;
              justify-content: center; /* จัดให้อยู่ตรงกลางแนวนอน */
              align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
              width: 100%; /* ให้ div เต็มความกว้างของเซลล์ */
              text-align: center; /* จัด text ให้อยู่ตรงกลาง */
              gap: 8px; /* เพิ่มระยะห่างระหว่างปุ่ม */
              flex-direction: column;
            "
          >
            <v-btn
              style="
                background-color: #c7c8cc;
                width: 100px;
                height: 25px;
                font-size: 14px;
                line-height: 1;
                margin-top: 4px;
              "
              @click="onClickBook(item)"
            >
              2 เล่ม
            </v-btn>
            <v-btn
              style="
                background-color: #b4c7e4;
                width: 100px;
                height: 25px;
                font-size: 14px;
                line-height: 1;
                margin-bottom: 4px;
              "
              @click="onClickForm(item)"
            >
              เสนอ
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
const searchFaculty = ref<string[]>(['ทั้งหมด'])
const searchText = ref('')
const loading = ref(false)
const serverItems = ref([])
const router = useRouter()
const faculties = ref<string[]>([])
// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ข้อมูลผู้คัดเลือก', key: 'name' },
  { title: 'คณะ', key: 'faculty_name' },
  { title: 'หน่วยงาน/สาขา', key: 'department_name' },
  { title: 'E-mail', key: 'user_email' },
  { title: 'เบอร์โทรศัพท์', key: 'user_tel' },
  { title: 'จำนวน', key: 'quantity', align: 'center' },
]

const removeItem = (index: number) => {
  searchFaculty.value.splice(index, 1)
}

const fetchTeachersData = async () => {
  loading.value = true

  try {
    const response = await axios.get('http://bookfair.buu.in.th:8043/teachers')
    let data = response.data

    // ดึงรายชื่อคณะจากข้อมูล API
    faculties.value = [...new Set(data.map((item) => item.faculty_name))]

    // กรองข้อมูลตามคณะที่เลือก (รองรับ multiple select)
    if (searchFaculty.value.length > 0 && !searchFaculty.value.includes('ทั้งหมด')) {
      data = data.filter((item) => searchFaculty.value.includes(item.faculty_name))
    }

    // กรองข้อมูลตามชื่อ (ถ้ามีการพิมพ์)
    if (searchText.value) {
      const searchValue = searchText.value.toLowerCase()
      data = data.filter((item) =>
        `${item.user_prefix}${item.user_firstName}${item.user_lastName}`
          .toLowerCase()
          .includes(searchValue),
      )
    }

    // การแปลงข้อมูลให้ตรงกับ headers
    serverItems.value = data.map((item) => ({
      id: item.teacher_id,
      name: `${item.user_prefix} ${item.user_firstName} ${item.user_lastName}`,
      faculty_name: item.faculty_name,
      department_name: item.department_name,
      user_email: item.user.user_email,
      user_tel: item.user.user_tel,
      quantity: item.e_coupon,
    }))
  } catch (error) {
    console.error('Error fetching teachers data:', error)
  } finally {
    loading.value = false
  }
}

const onClickBook = (item) => {
  if (item && item.id) {
    router.push({ name: 'showBookAdmin', params: { itemId: item.id } })
  } else {
    console.error('Item or item.id is undefined')
  }
}

const onClickForm = (item) => {
  if (item && item.id) {
    router.push({ name: 'BookFormAdmin', params: { itemId: item.id } })
  } else {
    console.error('Item or item.id is undefined')
  }
}

// ติดตามการเปลี่ยนแปลงของ searchFaculty และเรียก onSearch
watch(searchFaculty, () => {
  fetchTeachersData()
})

// เรียก fetchTeachersData ครั้งแรกเมื่อ component ถูกโหลด
onMounted(() => {
  fetchTeachersData()
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

.select-faculty {
  width: 400px;
}
</style>
