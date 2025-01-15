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
import 'jspdf-autotable'

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

const onClickFile = () => {
  const doc = new jsPDF() // สร้างเอกสาร PDF ใหม่

  // เพิ่มฟอนต์ลงใน VFS
  doc.addFileToVFS('Kanit-Bold.ttf', kanitBoldBase64)
  doc.addFileToVFS('Kanit-Regular.ttf', kanitRegularBase64)

  // เพิ่มฟอนต์ใน PDF
  doc.addFont('Kanit-Bold.ttf', 'Kanit-Bold', 'normal')
  doc.addFont('Kanit-Regular.ttf', 'Kanit-Regular', 'normal')

  // กำหนดการใช้ฟอนต์
  doc.setFont('Kanit-Regular') // ใช้ฟอนต์ Kanit-Regular

  // กำหนดหัวข้อ PDF และข้อมูล
  doc.setFontSize(18)
  doc.text('สรุปงบประมาณ', 14, 20)

  // เพิ่มวัน/เวลา ที่สร้างไฟล์
  const date = new Date()
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  doc.setFontSize(12)
  doc.text(`วันที่สร้างไฟล์: ${formattedDate}`, 14, 30)

  // สร้างตารางข้อมูล
  const tableHeaders = ['ลำดับ', 'คณะ', 'จำนวนเงิน (บาท)']
  const tableData = serverItems.value.map((item, index) => [
    (index + 1).toString(),
    item.name,
    item.budget.toLocaleString(),
  ])

  doc.autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: [255, 204, 0], // สีพื้นหลังหัวตาราง
    },
  })

  // รวมจำนวนเงิน
  const totalText = `รวมงบประมาณ: ${totalBudget.value} บาท`
  doc.setFontSize(14)
  doc.text(totalText, 14, doc.lastAutoTable.finalY + 10)

  // ดาวน์โหลดไฟล์ PDF
  doc.save('budget-summary.pdf')
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
