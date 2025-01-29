<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container class="budget-summary-container">
      <!-- Header -->
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6">
          <v-row>
            <div class="header">
              <img class="header-image" src="@/assets/budget-color.png" alt="Budget Image" />
              <h1 style="font-size: 25px">จัดการงบประมาณ</h1>
            </div>
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
                <div class="progress-container" style="position: relative">
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
                    :value="progressValue"
                    height="18"
                    :color="getProgressColor(progressValue)"
                    rounded
                    style="width: 100%; position: absolute; top: 0; left: 0"
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
      <v-row align="center" justify="start" style="margin-top: 5px; margin-bottom: 5px">
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

            <v-btn
              style="background-color: #fcdc94; width: 40px; height: 40px; margin-right: 8px"
              @click="onClickAddMoney"
            >
              <v-icon style="font-size: 40px">mdi-cash</v-icon>
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
        :items="serverItems"
        item-value="id"
        class="budget-table"
        :hide-default-footer="true"
        :items-per-page="-1"
        dense
        fixed-header
        height="auto"
        style="width: 100%; table-layout: auto"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td :style="{ textAlign: 'start', width: '10%' }">{{ item.id }}</td>
            <td :style="{ textAlign: 'left', width: '50%', whiteSpace: 'nowrap' }">
              {{ item.faculty }}
            </td>
            <td :style="{ textAlign: 'right', width: '40%' }" @dblclick="startEditing(item)">
              <v-text-field
                v-if="item.editing"
                v-model="item.budget"
                type="number"
                variant="outlined"
                dense
                single-line
                hide-details
                @blur="saveBudget(item)"
                @keydown.enter="saveBudget(item)"
              />
              <span v-else>
                {{ item.budget.toLocaleString() }}
              </span>
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

        <!-- แถวผลรวม -->
        <template v-slot:body.append>
          <tr>
            <td colspan="2" class="text-right font-weight-bold" style="padding: 8px">รวม</td>
            <td class="text-right font-weight-bold" style="padding: 8px">
              {{ formattedTotalUsedBudget }}
            </td>
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

  <!-- Dialog สำหรับ Add Money -->
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

  <v-dialog v-model="dialogDelete" max-width="400px">
    <v-card>
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
        <div
          style="
            flex-grow: 1;
            font-size: 16px;
            font-weight: bold;
            text-align: left;
            padding-left: 16px;
          "
        >
          ยืนยันการลบ
        </div>
        <v-icon
          @click="dialogDelete = false"
          color="red"
          class="cursor-pointer"
          style="font-size: 35px"
        >
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text> คุณแน่ใจหรือไม่ว่าจะลบรายการนี้? </v-card-text>
      <v-card-actions>
        <v-btn text @click="dialogDelete = false">ยกเลิก</v-btn>
        <v-btn color="red" @click="deleteItem">ลบ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import WebFontLoader from 'webfontloader'
import BuuLogo from '@/assets/Buu-logo11.png'

const loading = ref(false)
const selectedYear = ref<number | null>(null)
const currentYear = new Date().getFullYear() + 543 // ปีปัจจุบันใน พ.ศ.
const years = Array.from({ length: currentYear - 2517 }, (_, i) => 2518 + i) // ช่วงปี พ.ศ. (เริ่มที่ 2518)
const router = useRouter()
const dialogAdd = ref(false) // สถานะการแสดง Dialog
const newFaculty = ref('') // ชื่อคณะใหม่
const newTotal = ref(0) // จำนวนงบประมาณใหม่
const dialogAddMoney = ref(false) // สถานะการแสดง Dialog สำหรับเพิ่มเงิน
const moneyAmount = ref(0) // จำนวนเงินที่เพิ่ม
const totalBudget = ref(0) // งบประมาณรวมเริ่มต้น
const items = ref()
const dialogDelete = ref(false) // สถานะการแสดง dialog
const selectedItem = ref(null) // ไว้เก็บข้อมูลของรายการที่เลือก

const serverItems = ref([
  { id: 1, faculty: 'คณะดนตรีและการแสดง', budget: 50000, date: '13/01/2568', editing: false },
  { id: 2, faculty: 'คณะบริหารธุรกิจ', budget: 70000, date: '13/01/2568', editing: false },
  { id: 3, faculty: 'คณะพยาบาลศาสตร์', budget: 60000, date: '13/01/2568', editing: false },
  { id: 4, faculty: 'คณะภูมิสารสนเทศศาสตร์', budget: 50000, date: '13/01/2568', editing: false },
  {
    id: 5,
    faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
    budget: 70000,
    date: '13/01/2568',
    editing: false,
  },
  {
    id: 6,
    faculty: 'คณะรัฐศาสตร์และนิติศาสตร์',
    budget: 60000,
    date: '13/01/2568',
    editing: false,
  },
  { id: 7, faculty: 'คณะวิทยาการสารสนเทศ', budget: 50000, date: '13/01/2568', editing: false },
  { id: 8, faculty: 'คณะวิทยาศาสตร์', budget: 70000, date: '13/01/2568', editing: false },
  { id: 9, faculty: 'คณะวิทยาศาสตร์การกีฬา', budget: 60000, date: '13/01/2568', editing: false },
  {
    id: 10,
    faculty: 'คณะวิทยาศาสตร์และศิลปศาสตร์',
    budget: 70000,
    date: '13/01/2568',
    editing: false,
  },
  {
    id: 11,
    faculty: 'คณะวิทยาศาสตร์และสังคมศาสตร์',
    budget: 60000,
    date: '13/01/2568',
    editing: false,
  },
])

const headers = [
  { title: 'ID', value: 'id', align: 'start', width: '10%', minWidth: '80px' },
  { title: 'คณะ', value: 'faculty', align: 'left', width: '100%', minWidth: '20px' },
  { title: 'งบประมาณ (บาท)', value: 'budget', align: 'end', width: '40%', minWidth: '150px' },
  { title: '', key: 'actions', align: 'end' },
]

const filteredItems = computed(() => {
  if (selectedYear.value) {
    const filtered = serverItems.value.filter((item) => {
      const itemYear = parseInt(item.date.split('/')[2])
      return itemYear === selectedYear.value
    })
    console.log(filtered) // ตรวจสอบค่าใน filtered
    return filtered
  }
  console.log(serverItems.value) // ตรวจสอบค่าใน serverItems
  return serverItems.value
})

const onClickAdd = () => {
  dialogAdd.value = true
}

const onSaveNewItem = () => {
  if (newFaculty.value && newTotal.value > 0) {
    // เพิ่มรายการใหม่ไปยัง serverItems
    serverItems.value.push({
      id: serverItems.value.length + 1,
      faculty: newFaculty.value,
      budget: newTotal.value,
      date: new Date().toLocaleDateString('th-TH'),
      editing: false,
    })

    // อัปเดตค่าในการ์ด
    totalBudget.value -= newTotal.value

    // รีเซ็ตค่า
    newFaculty.value = ''
    newTotal.value = 0
    dialogAdd.value = false
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const clearNewTotal = () => {
  if (newTotal.value === 0) {
    newTotal.value = '' // เปลี่ยนค่าเป็นค่าว่างเมื่อคลิกที่ช่องกรอก
  }
}

// ฟังก์ชันที่ถูกเรียกเมื่อคลิกปุ่มลบ
const onClickDelete = (item) => {
  selectedItem.value = item // เก็บข้อมูลรายการที่เลือก
  dialogDelete.value = true // แสดง dialog
}

// ฟังก์ชันลบรายการ
const deleteItem = () => {
  // ลบรายการจากข้อมูล
  const index = items.value.findIndex((i) => i.id === selectedItem.value.id)
  if (index !== -1) {
    items.value.splice(index, 1) // ลบรายการ
  }
  dialogDelete.value = false // ซ่อน dialog
}

const updateRemainingBudget = () => {
  formattedRemainingBudget.value = totalBudget.value - newTotal.value
}

const onYearChange = (year: number | null) => {
  console.log('ปีที่เลือก:', year)
}

const onClickAddMoney = () => {
  dialogAddMoney.value = true
}

const onSaveAddMoney = () => {
  if (moneyAmount.value > 0) {
    totalBudget.value += moneyAmount.value
    moneyAmount.value = 0
    dialogAddMoney.value = false
  } else {
    alert('กรุณากรอกจำนวนเงินที่ต้องการเพิ่ม')
  }
}

const clearMoneyAmount = () => {
  if (moneyAmount.value === 0) {
    moneyAmount.value = ''
  }
}

// เมื่อออกจากช่องกรอก (Blur) => ถ้ายังไม่มีค่า ให้กลับเป็น 0
const resetMoneyAmount = () => {
  if (moneyAmount.value === '' || moneyAmount.value === null) {
    moneyAmount.value = 0
  }
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

// คำนวณยอดรวมของงบประมาณที่ใช้ไป
const totalUsedBudget = computed(() => {
  return Object.values(usedBudgetByFaculty.value).reduce((sum, value) => sum + value, 0)
})

const formattedTotalUsedBudget = computed(() => totalUsedBudget.value.toLocaleString())

const formattedTotalBudget = computed(() => totalBudget.value.toLocaleString())

const remainingBudget = computed(() => totalBudget.value - usedBudget.value)

const formattedRemainingBudget = computed(() => remainingBudget.value.toLocaleString())

const progressValue = computed(() =>
  totalBudget.value > 0 ? (usedBudget.value / totalBudget.value) * 100 : 0,
)

const getProgressColor = (progress) => {
  if (progress < 50) return 'green'
  if (progress < 80) return 'orange'
  return 'red'
}

const startEditing = (item) => {
  item.editing = true
}

const saveBudget = (item) => {
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

  const fontBase64 = await loadFontAsBase64('/Sarabun/Sarabun-Regular.ttf')
  doc.addFileToVFS('Sarabun-Regular.ttf', fontBase64)
  doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal')
  doc.setFont('Sarabun', 'normal')
  doc.setFontSize(16)

  const logoBase64 = await imageBuu()
  const logoWidth = 30
  const logoHeight = 30
  const logoX = (doc.internal.pageSize.width - logoWidth) / 2
  const logoY = 20
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight)

  const formattedDate = formatDatePdf()

  const text = 'สรุปงบประมาณ'
  const text_x = (doc.internal.pageSize.width - doc.getTextWidth(text)) / 2
  const text_y = logoY + logoHeight + 10
  doc.text(text, text_x, text_y)

  const text1 = `ประจำปี ${selectedYear.value}`
  const text1_x = (doc.internal.pageSize.width - doc.getTextWidth(text1)) / 2
  const text1_y = text_y + 10
  doc.text(text1, text1_x, text1_y)

  doc.setFontSize(11)
  const dateX = doc.internal.pageSize.width - doc.getTextWidth(formattedDate) - 10
  const dateY = 10
  doc.text(formattedDate, dateX, dateY)

  const tableData = filteredItems.value.map((item, index) => [
    (index + 1).toString(),
    item.faculty,
    item.budget.toLocaleString(),
  ])

  autoTable(doc, {
    head: [['ลำดับ', 'คณะ', 'จำนวนเงิน (บาท)']],
    body: tableData,
    startY: text_y + 20,
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

  doc.save(`budget-summary-${selectedYear.value}.pdf`)
}

watch(newTotal, updateRemainingBudget)

onMounted(() => {
  selectedYear.value = currentYear
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

.summary-card {
  background-color: #e0e6f0;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  width: 300px;
}

.summary-title {
  font-weight: bold;
  font-size: 18px;
}

.summary-amount {
  font-size: 20px;
  color: #000;
}

.summary-row {
  display: flex;
  align-items: center; /* จัดให้อยู่ตรงกลางในแนวตั้ง */
  justify-content: space-between; /* เว้นระยะระหว่างข้อความและตัวเลข */
}

.summary-card-remain {
  background-color: #e0e6f0;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  width: 400px;
}

.summary-label {
  font-size: 18px;
  font-weight: bold;
}

.summary-amount {
  font-size: 18px;
  color: #464545;
  margin-left: 8px; /* เพิ่มระยะห่างเล็กน้อย */
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
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cursor-pointer {
  cursor: pointer;
}

.budget-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.budget-table th,
.budget-table td {
  padding: 8px;
  text-align: center;
  word-wrap: break-word;
}

.budget-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.budget-table td.text-left {
  text-align: left;
}

.budget-table td.text-right {
  text-align: right;
}

.budget-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialog-container {
  border-radius: 12px;
}

.card-dialog {
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cursor-pointer {
  cursor: pointer;
}

.budget-table td.text-left {
  text-align: left; /* จัดข้อมูลในคอลัมน์คณะให้ชิดซ้าย */
}

.budget-table td.text-right {
  text-align: right; /* จัดข้อมูลในคอลัมน์งบประมาณให้ชิดขวา */
}

.budget-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-container {
  position: relative; /* กำหนดให้เป็น container สำหรับหลอดซ้อนทับ */
  height: 18px; /* ความสูงของหลอด */
}

.v-progress-linear {
  border-radius: 10px; /* ทำให้มุมโค้ง */
}

.v-progress-linear__background {
  background-color: #e0e0e0; /* สีพื้นหลังของหลอดเป้าหมาย */
}

.v-progress-linear__determinate {
  transition: width 0.5s ease; /* เพิ่ม animation ให้ความคืบหน้า */
}
</style>
