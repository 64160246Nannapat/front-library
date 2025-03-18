<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container class="budget-summary-container" fluid>
      <!-- Header -->
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6">
          <v-row>
            <div class="header">
              <img class="header-image" src="@/assets/budget-color.png" alt="Budget Image" />
              <h1 style="font-size: 25px">จัดการงบประมาณ</h1>
            </div>
          </v-row>
          <v-row>
            <h3 style="margin-left: 76px">{{ userFacultyName }}</h3>
          </v-row>
        </v-col>

        <v-row class="mb-6">
          <v-col cols="12">
            <v-card style="background-color: #ede8dc; border-radius: 16px">
              <v-card-title class="text-overline d-flex justify-space-between">
                <span style="font-size: 20px; font-weight: bold">งบประมาณคงเหลือ</span>
                <span class="text-h6 text-medium-emphasis font-weight-regular">
                  {{ formattedRemainingBudget }} บาท
                </span>
              </v-card-title>

              <v-card-text>
                <!-- หลอดทั้งหมด -->
                <div class="progress-container" style="position: relative; height: 18px">
                  <!-- หลอดเป้าหมาย -->
                  <v-progress-linear
                    :value="100"
                    height="18"
                    color="#e0e0e0"
                    rounded
                    style="width: 100%"
                  ></v-progress-linear>

                  <!-- หลอดดำเนินการ (ความคืบหน้า) -->
                  <v-progress-linear
                    v-model="animatedProgressValue"
                    height="18"
                    :color="totalBudget > 0 ? getProgressColor(animatedProgressValue) : 'grey'"
                    rounded
                    style="
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      transition: width 0.6s ease-in-out;
                    "
                  ></v-progress-linear>
                </div>

                <div class="d-flex justify-space-between py-3">
                  <span class="text-medium-emphasis"
                    >ใช้ไป: {{ formattedTotalUsedBudget }} บาท</span
                  >
                  <span class="text-medium-emphasis">
                    งบประมาณรวม: {{ formattedTotalBudget }} บาท
                  </span>
                </div>
              </v-card-text>

              <v-divider></v-divider>
            </v-card>
          </v-col>
        </v-row>
      </v-row>

      <!-- Dropdown ปี -->
      <v-row align="center" justify="start" style="margin-top: 30px; margin-bottom: 10px">
        <v-col cols="auto" class="d-flex justify-start align-center">
          <v-select
            v-model="selectedYear"
            :items="years"
            hide-details
            rounded="lg"
            variant="outlined"
            style="width: 120px; background-color: #fcdc94; border-radius: 10px"
            :menu-props="{ maxHeight: '300' }"
            @change="onYearChange"
          ></v-select>
        </v-col>

        <v-row justify="end">
          <v-col class="d-flex justify-end">
            <v-btn
              style="background-color: #fcdc94; width: 40px; height: 40px; margin-right: 8px"
              @click="onClickAdd"
            >
              <v-icon style="font-size: 30px">mdi-plus</v-icon>
            </v-btn>
            <!-- <v-btn
              style="background-color: #fcdc94; width: 40px; height: 40px; margin-right: 8px"
              @click="onClickAddMoney"
            >
              <v-icon style="font-size: 40px">mdi-cash</v-icon>
            </v-btn> -->
            <v-btn
              style="background-color: #fcdc94; width: 40px; height: 40px; margin-right: 8px"
              @click="onClickPerson"
            >
              <v-icon style="font-size: 30px">mdi-account</v-icon>
            </v-btn>
            <v-btn
              style="background-color: #fcdc94; width: 20px; height: 40px; margin-right: 15px"
              @click="onClickFile"
            >
              <v-icon style="font-size: 30px">mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-row>

      <!-- ตารางข้อมูล -->
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :loading="loading"
        item-key="id"
        class="budget-table"
        :hide-default-footer="true"
        :items-per-page="-1"
      >
        <template v-slot:body="{ items }">
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.department_name }}</td>
            <td class="text-right">{{ item.e_coupon.toLocaleString() }}</td>

            <td class="text-right">
              <v-btn
                color="#D9D9D9"
                icon
                @click="onClickDepartment(item)"
                style="border-radius: 8px; width: 50px; height: 30px"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </td>
            <td class="text-right">
              <v-btn
                color="transparent"
                icon
                @click="onEdit(item)"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-shadow: none;
                "
              >
                <v-icon>{{ item.editing ? 'mdi-check' : 'mdi-pencil-outline' }}</v-icon>
              </v-btn>
            </td>
            <td class="text-right">
              <v-btn
                color="transparent"
                icon
                @click="onClickDelete(item)"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-shadow: none;
                "
              >
                <img
                  src="@/assets/bin.png"
                  alt="Delete"
                  style="width: 35px; height: 35px; border: none"
                />
              </v-btn>
            </td>
          </tr>
        </template>
        <template v-slot:body.append>
          <tr>
            <td colspan="2" class="text-right font-weight-bold">รวม</td>
            <td class="text-right font-weight-bold">{{ formattedTotalUsedBudget }}</td>
          </tr>
        </template>
      </v-data-table>

      <v-divider></v-divider>
    </v-container>
  </v-main>

  <!-- Dialog สำหรับ Add -->
  <v-dialog v-model="dialogAdd" max-width="500px" class="dialog-container">
    <v-card class="pa-4 card-dialog" style="background-color: #f5efe4; border-radius: 12px">
      <v-card-title
        class="d-flex align-center"
        style="
          background-color: #f8d8de;
          height: 80px;
          margin: -16px -16px 0 -16px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          justify-content: flex-end;
        "
      >
        <div
          style="
            flex-grow: 1;
            font-size: 16px;
            font-weight: bold;
            text-align: left;
            padding-left: 16px;
          "
        >
          งบประมาณทั้งหมด: {{ formattedTotalBudget }} บาท
          <br />
          งบประมาณคงเหลือ: {{ formattedRemainingBudget }} บาท
        </div>

        <v-icon
          @click="dialogAdd = false"
          color="red"
          class="cursor-pointer"
          style="font-size: 35px"
        >
          mdi-close
        </v-icon>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-row style="display: flex; align-items: center; margin-top: 12px">
          <v-col cols="2" style="text-align: left; font-size: 18px">คณะ:</v-col>
          <v-col cols="8">
            <v-text-field
              v-model="newFaculty"
              variant="outlined"
              dense
              style="margin-bottom: -20px; width: 100%"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row style="display: flex; align-items: center; margin-top: 12px">
          <v-col cols="2" style="text-align: left; font-size: 18px">จำนวน:</v-col>
          <v-col cols="8">
            <v-text-field
              v-model.number="newTotal"
              variant="outlined"
              dense
              type="number"
              style="margin-bottom: -20px; width: 100%"
              @focus="clearNewTotal"
              @input="updateRemainingBudget"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          @click="onSaveNewItem"
          class="elevated rounded-pill"
          style="background-color: #f5c8d0; color: #000; font-weight: bold; padding: 8px 16px"
        >
          บันทึก
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogAddMoney" max-width="400px" class="dialog-container">
    <v-card class="pa-4 card-dialog" style="background-color: #f5efe4; border-radius: 12px">
      <v-card-title
        class="d-flex align-center"
        style="
          background-color: #f8d8de;
          height: 60px;
          margin: -16px -16px 0 -16px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          justify-content: flex-end;
        "
      >
        <v-icon
          @click="dialogAddMoney = false"
          color="red"
          class="cursor-pointer"
          style="font-size: 35px"
        >
          mdi-close
        </v-icon>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-row style="display: flex; align-items: center; margin-top: 8px; margin-bottom: -8px">
          <v-col cols="3" style="text-align: left; font-size: 18px; padding-bottom: 0">
            จำนวนเงิน:
          </v-col>
          <v-col cols="8" style="padding-bottom: 0">
            <v-text-field
              v-model.number="moneyAmount"
              variant="outlined"
              dense
              type="number"
              style="margin: 0; width: 100%"
              @focus="clearMoneyAmount"
              @blur="resetMoneyAmount"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          @click="onSaveAddMoney"
          class="elevated rounded-pill"
          style="background-color: #f5c8d0; color: #000; font-weight: bold; padding: 8px 16px"
        >
          เพิ่ม
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogDelete" max-width="350px" class="dialog-container">
    <v-card
      class="pa-4 card-dialog"
      style="background-color: #f5efe4; border-radius: 12px; width: 350px"
    >
      <v-card-title
        class="d-flex align-center"
        style="
          background-color: #f8d8de;
          height: 60px;
          margin: -16px -16px 0 -16px;
          border-radius: 12px 12px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
        "
      >
        ยืนยันการลบ
      </v-card-title>

      <v-card-text class="text-center"> คุณแน่ใจหรือไม่ว่าจะลบรายการนี้? </v-card-text>

      <v-card-actions class="d-flex justify-space-between">
        <v-btn
          variant="outlined"
          @click="dialogDelete = false"
          style="
            background-color: #023e7d;
            color: white;
            border: 2px solid #023e7d;
            border-radius: 8px;
          "
        >
          ยกเลิก
        </v-btn>

        <v-btn
          variant="outlined"
          @click="deleteItem"
          style="
            background-color: #b42121;
            color: white;
            border: 2px solid #b42121;
            border-radius: 8px;
          "
          >ลบ</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import WebFontLoader from 'webfontloader'
import BuuLogo from '@/assets/Buu-logo11.png'
import axios from 'axios'

const loading = ref(false)
const selectedYear = ref<number | null>(null)
const currentYear = new Date().getFullYear() + 543 // ปีปัจจุบันใน พ.ศ.
const years = Array.from({ length: currentYear - 2517 }, (_, i) => 2518 + i) // ช่วงปี พ.ศ. (เริ่มที่ 2518)
const router = useRouter()
const dialogAdd = ref(false) // สถานะการแสดง Dialog
const newFaculty = ref('') // ชื่อคณะใหม่
const newId = ref('') // ID ใหม่
const updatedData = ref([])
const newTotal = ref(0) // จำนวนงบประมาณใหม่
const dialogAddMoney = ref(false) // สถานะการแสดง Dialog สำหรับเพิ่มเงิน
const moneyAmount = ref(0) // จำนวนเงินที่เพิ่ม
const totalBudget = ref(0) // งบประมาณรวมเริ่มต้น
const items = ref<{ faculty: string; total: number }[]>([])
const dialogDelete = ref(false) // สถานะการแสดง dialog
const selectedItem = ref(null) // ไว้เก็บข้อมูลของรายการที่เลือก
const animatedProgressValue = ref(0)

const onEdit = (item) => {
  item.editing = !item.editing // กดสลับระหว่างเปิด-ปิด
}

const userFacultyName = ref('')
const facultyData = ref([])
const departmentData = ref([])

// สมมติว่าได้ข้อมูล faculty_name จากผู้ใช้ที่ล็อกอิน
const decodedUserData = JSON.parse(localStorage.getItem('userData')) || {}

const fetchUserFaculty = async () => {
  try {
    // เช็คว่ามีข้อมูล faculty_name จาก decodedUserData หรือไม่
    userFacultyName.value = decodedUserData.faculty_name || ''
    console.log('Decoded Faculty Name:', userFacultyName.value)

    if (!userFacultyName.value) {
      console.error('❌ ไม่มีข้อมูล faculty_name สำหรับผู้ใช้ที่ล็อกอิน')
      return
    }

    const response = await axios.get('http://bookfair.buu.in.th:8043/faculties')
    console.log('📥 Faculty API Response:', response.data)

    if (Array.isArray(response.data)) {
      facultyData.value = response.data

      // ค้นหา faculty_name ที่ตรงกับชื่อ faculty_name ของผู้ใช้
      const matchedFaculty = facultyData.value.find(
        (fac) => fac.faculty_name === userFacultyName.value,
      )

      if (matchedFaculty && matchedFaculty.faculty_name) {
        userFacultyName.value = matchedFaculty.faculty_name.trim()
        console.log('✅ Faculty Name Set:', userFacultyName.value)

        // ถ้าเจอ faculty_name ให้ดึงข้อมูลสาขาต่อ
        await fetchFacultyData()
      } else {
        console.error('⚠️ ไม่พบ faculty_name ที่ตรงกับ user')
      }
    } else {
      console.error('❌ API Response ไม่ใช่ Array')
    }
  } catch (error) {
    console.error('❌ Error fetching user faculty:', error)
  }
}

const fetchFacultyData = async () => {
  try {
    const response = await axios.get('http://bookfair.buu.in.th:8043/departments')
    console.log('📥 Departments API Response:', response.data)

    if (Array.isArray(response.data)) {
      // ค้นหาสาขาที่อยู่ภายใต้ faculty_name ของผู้ใช้
      departmentData.value = response.data.filter(
        (dept) => dept.faculty_name?.trim() === userFacultyName.value,
      )

      console.log('✅ Filtered Departments:', departmentData.value)
    } else {
      console.error('❌ API Response ไม่ใช่ Array')
    }
  } catch (error) {
    console.error('❌ Error fetching faculty data:', error)
  }
}

const filteredItems = computed(() => {
  return departmentData.value.map((dept, index) => ({
    id: index + 1,
    department_name: dept.department_name,
    e_coupon: dept.e_coupon,
  }))
})

onMounted(fetchUserFaculty)

// const serverItems = ref([
//   { id: 1, faculty: 'วิทยาการคอมพิวเตอร์', budget: 50000, date: '13/01/2568', editing: false },
//   {
//     id: 2,
//     faculty: 'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
//     budget: 70000,
//     date: '13/01/2568',
//     editing: false,
//   },
//   { id: 3, faculty: 'วิศวกรรมซอฟต์แวร์', budget: 60000, date: '13/01/2568', editing: false },
//   {
//     id: 4,
//     faculty: 'ปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ',
//     budget: 50000,
//     date: '13/01/2568',
//     editing: false,
//   },
//   {
//     id: 5,
//     faculty: 'วิทยาการข้อมูล หลักสูตรวิทยาศาสตรมหาบัณฑิต',
//     budget: 70000,
//     date: '13/01/2568',
//     editing: false,
//   },
//   {
//     id: 6,
//     faculty: 'วิทยาการข้อมูล หลักสูตรปรัชญาดุษฎีบัณฑิต',
//     budget: 60000,
//     date: '13/01/2568',
//     editing: false,
//   },
//   { id: 7, faculty: 'สายสนับสนุนวิชาการ', budget: 60000, date: '13/01/2568', editing: false },
//   {
//     id: 8,
//     faculty: 'วิทยาการข้อมูล หลักสูตรวิทยาศาสตรมหาบัณฑิต',
//     budget: 70000,
//     date: '13/12/2567',
//     editing: false,
//   },
//   {
//     id: 9,
//     faculty: 'วิทยาการข้อมูล หลักสูตรปรัชญาดุษฎีบัณฑิต',
//     budget: 60000,
//     date: '13/12/2567',
//     editing: false,
//   },
// ])

const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'สาขา', key: 'department_name' },
  { title: 'งบประมาณ', key: 'e_coupon', align: 'end' },
  { title: '', key: 'actions', align: 'end' },
  { title: '', key: 'actions', align: 'end' },
  { title: '', key: 'actions', align: 'end' },
]

const onClickAdd = () => {
  dialogAdd.value = true // แสดง Dialog เมื่อคลิก Add
}

const onSaveNewItem = () => {
  if (newFaculty.value && newTotal.value > 0) {
    // เพิ่มรายการใหม่ไปยัง facultyData
    facultyData.value.push({
      id: facultyData.value.length + 1,
      faculty_name: newFaculty.value,
      budget: newTotal.value,
      date: new Date().toLocaleDateString('th-TH'),
      editing: false,
    })
    newFaculty.value = ''
    newTotal.value = 0
    dialogAdd.value = false
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const onClickDelete = (item) => {
  selectedItem.value = item // เก็บข้อมูลรายการที่เลือก
  dialogDelete.value = true // แสดง dialog
}

const deleteItem = () => {
  const index = facultyData.value.findIndex((i) => i.id === selectedItem.value.id)
  if (index !== -1) {
    facultyData.value.splice(index, 1) // ลบรายการ
  }
  dialogDelete.value = false // ซ่อน dialog
}

const onClickPerson = () => {
  router.push({ name: 'manageBudPerFaculty' })
}

const onClickDepartment = () => {
  router.push({ name: 'ManageBudDeFaculty' })
}

const clearNewTotal = () => {
  if (newTotal.value === 0) {
    newTotal.value = '' // เปลี่ยนค่าเป็นค่าว่างเมื่อคลิกที่ช่องกรอก
  }
}

const onYearChange = (year: number | null) => {
  console.log('ปีที่เลือก:', year)
}

const usedBudget = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + item.budget, 0)
})

const usedBudgetByFaculty = computed(() => {
  return filteredItems.value.reduce(
    (acc, item) => {
      if (!acc[item.faculty]) {
        acc[item.faculty] = 0
      }
      acc[item.faculty] += item.budget
      return acc
    },
    {} as Record<string, number>,
  )
})

const updateRemainingBudget = () => {
  formattedRemainingBudget.value = totalBudget.value - newTotal.value
}

const totalUsedBudget = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + (parseFloat(item.budget) || 0), 0)
})

const formattedTotalUsedBudget = computed(() => totalUsedBudget.value.toLocaleString())

const formattedTotalBudget = computed(() => totalBudget.value.toLocaleString())

const remainingBudget = computed(() => totalBudget.value - totalUsedBudget.value)

const formattedRemainingBudget = computed(() => remainingBudget.value.toLocaleString())

const progressPercentage = computed(() => {
  return (totalUsedBudget.value / totalBudget.value) * 100
})

// const progressValue = computed(() =>
//   totalBudget.value > 0 ? (usedBudget.value / totalBudget.value) * 100 : 0,
// )

const getProgressColor = (progress) => {
  if (progress < 50) return 'green'
  if (progress < 80) return 'orange'
  return 'red'
}

const onClickAddMoney = () => {
  dialogAddMoney.value = true
}

const onSaveAddMoney = () => {
  if (moneyAmount.value > 0) {
    totalBudget.value += moneyAmount.value // เพิ่มเงินเข้าไปใน totalBudget
    moneyAmount.value = 0 // รีเซ็ตค่าเงินที่กรอก
    dialogAddMoney.value = false // ปิด dialog
  } else {
    alert('กรุณากรอกจำนวนเงินที่ต้องการเพิ่ม')
  }
}

const clearMoneyAmount = () => {
  if (moneyAmount.value === 0) {
    moneyAmount.value = '' // เคลียร์ค่าถ้าเป็น 0
  }
}

const resetMoneyAmount = () => {
  if (moneyAmount.value === '' || moneyAmount.value === null) {
    moneyAmount.value = 0 // รีเซ็ตค่าเป็น 0 หากกรอกไม่ได้
  }
}

const startEditing = (item) => {
  item.editing = true
}

const saveBudget = (item) => {
  // แปลงค่าที่ป้อนเป็นตัวเลข ถ้าไม่ใช่ตัวเลขให้ใช้ค่า 0
  const newBudget = parseFloat(item.budget) || 0
  const oldBudget = item.oldBudget || 0 // เก็บค่าก่อนแก้ไข

  // คำนวณความเปลี่ยนแปลงของงบประมาณ
  const difference = newBudget - oldBudget

  // อัปเดตงบประมาณใหม่
  item.budget = newBudget
  item.oldBudget = newBudget

  // อัปเดตค่า totalUsedBudget และ remainingBudget
  totalUsedBudget.value += difference
  remainingBudget.value = totalBudget.value - totalUsedBudget.value

  // อัปเดตการ์ดแสดงผล
  formattedTotalUsedBudget.value = totalUsedBudget.value.toLocaleString()
  formattedRemainingBudget.value = remainingBudget.value.toLocaleString()

  // ปิดโหมดแก้ไข
  item.editing = false
}

const loadFontAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Cannot load font')
  const buffer = await response.arrayBuffer()
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

const imageBuu = async () => {
  const response = await fetch(BuuLogo)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1]) // Return base64 string
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ฟอร์แมตวันที่แบบกำหนดเอง
const formatDatePdf = (): string => {
  const now = new Date()
  const yearBuddhist = now.getFullYear() + 543 // เปลี่ยนเป็นปี พ.ศ.
  const month = String(now.getMonth() + 1).padStart(2, '0') // เดือน (01-12)
  const day = String(now.getDate()).padStart(2, '0') // วัน (01-31)
  const hours = String(now.getHours()).padStart(2, '0') // ชั่วโมง (00-23)
  const minutes = String(now.getMinutes()).padStart(2, '0') // นาที (00-59)
  return `${day}/${month}/${yearBuddhist} ${hours}:${minutes}`
}

const onClickFile = async () => {
  const doc = new jsPDF()

  // โหลดฟอนต์ Sarabun
  const fontBase64 = await loadFontAsBase64('/Sarabun/Sarabun-Regular.ttf')
  doc.addFileToVFS('Sarabun-Regular.ttf', fontBase64)
  doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal')
  doc.setFont('Sarabun', 'normal')
  doc.setFontSize(16)

  // เพิ่มโลโก้ BUU
  const logoBase64 = await imageBuu()
  const logoWidth = 30
  const logoHeight = 30
  const logoX = (doc.internal.pageSize.width - logoWidth) / 2
  const logoY = 20
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight)

  // เพิ่มหัวข้อ PDF
  const formattedDate = formatDatePdf()
  const text = 'สรุปงบประมาณ'
  const textX = (doc.internal.pageSize.width - doc.getTextWidth(text)) / 2
  const textY = logoY + logoHeight + 10
  doc.text(text, textX, textY)

  const facultyText = 'คณะ วิทยาการสารสนเทศ'
  const facultyX = (doc.internal.pageSize.width - doc.getTextWidth(facultyText)) / 2
  const facultyY = textY + 10
  doc.text(facultyText, facultyX, facultyY)

  const yearText = `ประจำปี ${selectedYear.value}`
  const yearX = (doc.internal.pageSize.width - doc.getTextWidth(yearText)) / 2
  const yearY = facultyY + 10
  doc.text(yearText, yearX, yearY)

  // เพิ่มวันที่ในมุมขวาบน
  doc.setFontSize(11)
  const dateX = doc.internal.pageSize.width - doc.getTextWidth(formattedDate) - 10
  const dateY = 10
  doc.text(formattedDate, dateX, dateY)

  // สร้างตารางข้อมูล
  const tableData = filteredItems.value.map((item, index) => [
    (index + 1).toString(),
    item.faculty,
    item.budget.toLocaleString(),
  ])
  autoTable(doc, {
    head: [['ลำดับ', 'สาขา', 'จำนวนเงิน (บาท)']],
    body: tableData,
    startY: yearY + 20,
    styles: {
      font: 'Sarabun',
      fontSize: 12,
    },
    headStyles: {
      fillColor: [102, 102, 0],
      textColor: [255, 255, 255],
      font: 'Sarabun',
      fontSize: 12,
    },
  })

  // เพิ่มผลรวมงบประมาณ
  const totalBudget = filteredItems.value
    .reduce((sum, item) => sum + item.budget, 0)
    .toLocaleString()
  const totalText = `งบประมาณรวม ${totalBudget} บาท`
  doc.setFontSize(14)
  doc.text(
    totalText,
    doc.internal.pageSize.width - doc.getTextWidth(totalText) - 10,
    doc.lastAutoTable.finalY + 10,
  )

  // บันทึก PDF
  doc.save(`budget-summary-${selectedYear.value}.pdf`)
}

watch(progressPercentage, (newValue) => {
  animatedProgressValue.value = newValue
})

watch(totalUsedBudget, (newValue) => {
  remainingBudget.value = totalBudget.value - newValue
  formattedRemainingBudget.value = remainingBudget.value.toLocaleString()
})

onMounted(() => {
  selectedYear.value = currentYear
  if (router.currentRoute.value.state?.updatedData) {
    updatedData.value = router.currentRoute.value.state.updatedData
  }
})
</script>

<style scoped>
.budget-summary-container {
  padding: 20px;
}

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

.summary-card {
  background-color: #e0e6f0;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  width: 350px;
}

.summary-title {
  font-weight: bold;
  font-size: 18px;
}

.summary-amount {
  font-size: 20px;
  color: #000;
}

.budget-table {
  margin-top: 20px;
}

.dialog-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* ทำให้ Dialog อยู่กลางแนวตั้ง */
}

.card-dialog {
  width: 600px;
  text-align: center; /* จัดข้อความตรงกลาง */
}
</style>
