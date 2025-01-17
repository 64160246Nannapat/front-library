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
            <td style="position: sticky">{{ item.faculty }}</td>
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
                  min-width: 200px;
                  max-width: 120px;
                  margin-top: 30px;
                  text-align: end;
                  position: sticky;
                  right: 0;
                  z-index: 1;
                  margin-left: 600px;
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import WebFontLoader from 'webfontloader'

const loading = ref(false)
const selectedYear = ref<number | null>(null)
const currentYear = new Date().getFullYear() + 543 // ปีปัจจุบันใน พ.ศ.
const years = Array.from({ length: currentYear - 2517 }, (_, i) => 2518 + i) // ช่วงปี พ.ศ. (เริ่มที่ 2518)
const totalBudgetInput = ref(0)
const router = useRouter()

// ฟอนต์ Base64 ที่แปลงแล้ว
const kanitBoldBase64 = 'S2FuaXQtQm9sZC50dGY=' // ใส่ Base64 ของ Kanit-Bold.ttf ที่แปลงแล้ว
const kanitRegularBase64 = 'S2FuaXQtUmVndWxhci50dGY=' // ใส่ Base64 ของ Kanit-Regular.ttf ที่แปลงแล้ว

const serverItems = ref([
  { id: 1, faculty: 'คณะดนตรีและการแสดง', budget: 50000, date: '13/01/2568' },
  { id: 2, faculty: 'คณะบริหารธุรกิจ', budget: 70000, date: '13/01/2568' },
  { id: 3, faculty: 'คณะพยาบาลศาสตร์', budget: 60000, date: '13/01/2568' },
  { id: 4, faculty: 'คณะภูมิสารสนเทศศาสตร์', budget: 50000, date: '13/01/2568' },
  { id: 5, faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์', budget: 70000, date: '13/01/2568' },
  { id: 6, faculty: 'คณะรัฐศาสตร์และนิติศาสตร์', budget: 60000, date: '13/01/2568' },
  { id: 7, faculty: 'คณะวิทยาการสารสนเทศ', budget: 50000, date: '13/01/2568' },
  { id: 8, faculty: 'คณะวิทยาศาสตร์', budget: 70000, date: '13/01/2568' },
  { id: 9, faculty: 'คณะวิทยาศาสตร์การกีฬา', budget: 60000, date: '13/01/2568' },
  { id: 10, faculty: 'คณะวิทยาศาสตร์และศิลปศาสตร์', budget: 70000, date: '13/01/2568' },
  { id: 11, faculty: 'คณะวิทยาศาสตร์และสังคมศาสตร์', budget: 60000, date: '13/01/2568' },
  { id: 12, faculty: 'คณะวิทยาศาสตร์และศิลปศาสตร์', budget: 70000, date: '13/01/2567' },
  { id: 13, faculty: 'คณะวิทยาศาสตร์และสังคมศาสตร์', budget: 60000, date: '13/01/2567' },
])

const headers = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'คณะ', key: 'faculty' },
  { title: 'งบประมาณ', key: 'budget', align: 'end' },
]

const onClickClose = () => {
  router.push({ name: 'manageBudgetAdmin' })
}

const onClickCheck = () => {
  router.push({
    name: 'manageBudgetAdmin',
    state: { updatedData: serverItems.value },
  })
}

// โหลดฟอนต์ Kanit ผ่าน WebFontLoader
WebFontLoader.load({
  google: {
    families: ['Kanit'],
  },
  active: function () {
    console.log('Font Kanit loaded successfully')
  },
})

const onClickFile = () => {
  const doc = new jsPDF()

  // โหลดฟอนต์ Kanit Bold และ Kanit Regular (Base64)
  doc.addFileToVFS('Kanit-Bold.ttf', kanitBoldBase64)
  doc.addFileToVFS('Kanit-Regular.ttf', kanitRegularBase64)

  // ตั้งฟอนต์เป็น Kanit Bold
  doc.setFont('Kanit-Bold')

  // เพิ่มข้อความที่ต้องการใส่ใน PDF
  doc.setFontSize(18)
  doc.text('สรุปงบประมาณ', 10, 10)

  doc.setFont('Kanit-Regular')
  doc.setFontSize(12)
  doc.text(`วันที่สร้างไฟล์: ${new Date().toLocaleDateString()}`, 10, 20)

  const tableData = serverItems.value.map((item, index) => [
    (index + 1).toString(),
    item.faculty,
    item.budget.toLocaleString(),
  ])

  doc.autoTable({
    head: [['ลำดับ', 'คณะ', 'จำนวนเงิน (บาท)']],
    body: tableData,
    startY: 30,
  })

  doc.text(
    `รวมงบประมาณ: ${serverItems.value.reduce((sum, item) => sum + item.budget, 0).toLocaleString()} บาท`,
    10,
    doc.lastAutoTable.finalY + 10,
  )

  doc.save('budget-summary.pdf')
}

// การกรองข้อมูลตามปีที่เลือก
const filteredItems = computed(() => {
  if (selectedYear.value) {
    return serverItems.value.filter((item) => {
      const itemYear = parseInt(item.date.split('/')[2]) // แยกปีจากวันที่
      return itemYear === selectedYear.value
    })
  }
  return serverItems.value // ถ้ายังไม่ได้เลือกปี, ให้แสดงข้อมูลทั้งหมด
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
</style>
