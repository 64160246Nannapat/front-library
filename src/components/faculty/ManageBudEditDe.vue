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
          <v-row>
            <h3 style="margin-left: 76px">สาชา วิทยาการคอมพิวเตอร์</h3>
          </v-row>
        </v-col>

        <v-col cols="12" md="6" class="d-flex justify-end">
          <v-card class="summary-card">
            <v-card-title class="summary-title text-center">งบประมาณรวม</v-card-title>
            <v-card-subtitle
              class="d-flex flex-column align-center justify-center"
              style="gap: 5px"
            >
              <v-text-field
                v-model="totalBudgetInput"
                class="summary-amount text-number"
                variant="outlined"
                dense
                @change="updateTotalBudget"
                @input="onInputOnlyNumber"
              />
              <span style="font-size: 16px; margin-left: 5px; margin-top: -20px">บาท</span>
            </v-card-subtitle>
          </v-card>
        </v-col>
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
          ></v-select>
        </v-col>

        <v-row justify="end">
          <v-col class="d-flex justify-end">
            <v-btn
              style="background-color: #c7c8cc; width: 20px; height: 40px; margin-right: 15px"
              @click="onClickFile"
            >
              <v-icon style="font-size: 30px">mdi-file-upload-outline</v-icon>
            </v-btn>
            <v-btn
              style="background-color: #d89393; width: 20px; height: 40px; margin-right: 15px"
              @click="onClickClose"
            >
              <v-icon style="font-size: 30px">mdi-close</v-icon>
            </v-btn>
            <v-btn
              style="background-color: #b0c5a4; width: 20px; height: 40px"
              @click="onClickCheck"
            >
              <v-icon style="font-size: 30px">mdi-check</v-icon>
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
        fixed-header
        class="budget-table"
        :hide-default-footer="true"
        :items-per-page="-1"
      >
        <template v-slot:top></template>
        <template v-slot:body>
          <tr v-for="item in filteredItems" :key="item.id">
            <td style="position: sticky">{{ item.id }}</td>
            <td style="position: sticky">{{ item.name }}</td>
            <td class="text-right" fixed>
              <v-text-field
                v-model="item.budget"
                class="text-number"
                variant="outlined"
                dense
                @input="onInputOnlyNumber"
                @change="updateBudget(item.id, item.budget.toString())"
                style="
                  width: 200px;
                  margin-top: 30px;
                  text-align: end;
                  position: sticky;
                  right: 0;
                  z-index: 1;
                  margin-left: 650px;
                "
              />
            </td>
          </tr>
          <tr>
            <td colspan="2" class="text-right font-weight-bold">รวม</td>
            <td class="text-right font-weight-bold">{{ totalBudget }}</td>
          </tr>
        </template>
      </v-data-table>

      <v-divider></v-divider>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import BuuLogo from '@/assets/Buu-logo11.png'

const loading = ref(false)
const selectedYear = ref<number | null>(null)
const currentYear = new Date().getFullYear() + 543 // ปีปัจจุบันใน พ.ศ.
const years = Array.from({ length: currentYear - 2517 }, (_, i) => 2518 + i) // ช่วงปี พ.ศ. (เริ่มที่ 2518)
const totalBudgetInput = ref(0)
const router = useRouter()
const searchText = ref('')
// ฟอนต์ Base64 ที่แปลงแล้ว
const kanitBoldBase64 = 'BASE64_STRING_OF_KANIT_BOLD' // ใส่ Base64 ของ Kanit-Bold.ttf ที่แปลงแล้ว
const kanitRegularBase64 = 'BASE64_STRING_OF_KANIT_REGULAR' // ใส่ Base64 ของ Kanit-Regular.ttf ที่แปลงแล้ว

const serverItems = ref([
  { id: 1, name: 'อาจารย์วรวิทย์ วีระพันธุ์', budget: 50000, date: '13/01/2568' },
  { id: 2, name: 'ผศ.ดร.พิเชษ วะยะลุน', budget: 70000, date: '13/01/2568' },
  { id: 3, name: 'ผศ.เบญจภรณ์ จันทรกองกุล', budget: 60000, date: '13/01/2568' },
  {
    id: 4,
    name: 'ผศ.ภูสิต กุลเกษม',
    budget: 50000,
    date: '13/01/2568',
  },
  {
    id: 5,
    name: 'ผศ.จรรยา อ้นปันส์',
    budget: 70000,
    date: '13/01/2568',
  },
  { id: 6, name: 'ผศ.ดร.โกเมศ อัมพวัน', budget: 60000, date: '13/01/2568' },
  { id: 7, name: 'ดร.วรัณรัชญ์ วิริยะวิทย์', budget: 60000, date: '13/01/2568' },
  { id: 8, name: 'อาจารย์วรวิทย์ วีระพันธุ์', budget: 50000, date: '13/01/2567' },
  { id: 9, name: 'ผศ.ดร.พิเชษ วะยะลุน', budget: 70000, date: '13/01/2567' },
  { id: 10, name: 'ผศ.เบญจภรณ์ จันทรกองกุล', budget: 60000, date: '13/01/2567' },
])

const headers = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'รายชื่อ', key: 'name' },
  { title: 'งบประมาณ', key: 'budget', align: 'end' },
]

const onClickClose = () => {
  router.push({ name: 'ManageBudDeFaculty' })
}

const onClickCheck = () => {
  router.push({
    name: 'ManageBudDeFaculty',
    state: { updatedData: serverItems.value },
  })
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

  const facultyText = 'สาขา วิทยาการคอมพิวเตอร์'
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
    item.name,
    item.budget.toLocaleString(),
  ])
  autoTable(doc, {
    head: [['ลำดับ', 'รายชื่อ', 'จำนวนเงิน (บาท)']],
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
  doc.save(`budget-summary-department-${selectedYear.value}.pdf`)
}

// การกรองข้อมูลตามปีที่เลือก
const filteredItems = computed(() => {
  let filtered = serverItems.value

  // กรองข้อมูลตามปีที่เลือก
  if (selectedYear.value) {
    filtered = filtered.filter((item) => {
      const itemYear = parseInt(item.date.split('/')[2])
      return itemYear === selectedYear.value
    })
  }

  // กรองข้อมูลตามการค้นหาชื่อ
  if (searchText.value) {
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(searchText.value.toLowerCase()),
    )
  }

  return filtered
})

const updateTotalBudget = () => {
  // อัปเดต totalBudgetInput เมื่อแก้ไข
  totalBudgetInput.value = parseFloat(totalBudgetInput.value.toString()) || 0

  // อัปเดตค่า totalBudget ที่คำนวณใหม่
  totalBudget.value = totalBudgetInput.value
}

const totalBudget = computed(() => {
  return filteredItems.value
    .reduce((sum, item) => {
      // แปลงค่า budget เป็นตัวเลข หากไม่ใช่ตัวเลข
      const budget = parseFloat(item.budget) || 0
      return sum + budget
    }, 0)
    .toLocaleString()
})

const updateBudget = (id: number, newBudget: string) => {
  const item = serverItems.value.find((item) => item.id === id)
  if (item) {
    item.budget = parseInt(newBudget) || 0 // อัปเดตค่า budget
  }
}

const onInputOnlyNumber = (event) => {
  const value = event.target.value
  event.target.value = value.replace(/[^0-9]/g, '') // ลบค่าที่ไม่ใช่ตัวเลข
}
const onSearch = () => {
  // อัพเดต filteredItems โดยตรงจากการค้นหาชื่อ
  filteredItems.value = serverItems.value.filter(
    (item) => item.name.toLowerCase().includes(searchText.value.toLowerCase()), // ค้นหาชื่อตามข้อความที่ป้อน
  )
}

watch(searchText, () => {
  onSearch() // เรียกใช้ onSearch ทุกครั้งที่ searchText เปลี่ยน
})

onMounted(() => {
  // ตั้งค่า selectedYear เป็นปีปัจจุบันเมื่อโหลดหน้า
  selectedYear.value = currentYear
})
</script>

<style scoped>
.budget-summary-container {
  padding: 20px;
  background-color: #fff9f4;
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
  height: 150px;
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

.text-number {
  width: 250px;
  border-radius: 10px;
  border: '2px solid';
  text-align: center;
  justify-content: center;
}

.custom-isbn {
  width: 80px;
  height: 56px;
  line-height: 56px;
}

.select-book {
  width: 400px;
}

.serch-text {
  width: 400px;
}
</style>
