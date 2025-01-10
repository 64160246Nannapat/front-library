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
            <v-card-title class="summary-title">งบประมาณรวม</v-card-title>
            <v-card-subtitle class="summary-amount">{{ totalBudget }} บาท</v-card-subtitle>
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
              style="background-color: #fcdc94; width: 40px; height: 40px; margin-right: 8px"
              @click="onClickAdd"
            >
              <v-icon style="font-size: 30px">mdi-plus</v-icon>
            </v-btn>
            <v-btn
              style="background-color: #fcdc94; width: 40px; height: 40px"
              @click="onClickEdit"
            >
              <v-icon style="font-size: 30px">mdi-square-edit-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-row>

      <!-- ตารางข้อมูล -->
      <v-data-table
        :headers="headers"
        :items="serverItems"
        :loading="loading"
        item-key="id"
        class="budget-table"
        :hide-default-footer="true"
      >
        <template v-slot:top></template>
        <template v-slot:body.append>
          <tr>
            <td colspan="2" class="text-right font-weight-bold">รวม</td>
            <td class="text-right font-weight-bold">{{ totalBudget }}</td>
          </tr>
        </template>
      </v-data-table>

      <v-divider></v-divider>
    </v-container>
  </v-main>

  <!-- Dialog สำหรับ Add -->
  <v-dialog v-model="dialogAdd" max-width="400px">
    <v-card class="pa-4" style="background-color: #f5efe4">
      <v-card-title class="justify-space-between pb-0">
        <span style="color: #000; font-size: 18px; font-weight: bold">เพิ่มข้อมูลใหม่</span>
        <v-icon @click="dialogAdd = false" color="red" class="cursor-pointer justify-end"> mdi-close </v-icon>
      </v-card-title>
      <v-card-text>
        <v-text-field label="ID" v-model="newId" dense outlined class="mt-4"></v-text-field>
        <v-text-field label="คณะ" v-model="newFaculty" dense outlined class="mt-3"></v-text-field>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          @click="onSaveNewItem"
          class="elevated rounded-pill"
          style="background-color: #f5c8d0; color: #000; font-weight: bold"
        >
          บันทึก
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(false)
const selectedYear = ref(2024)
const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1974 }, (_, i) => 1975 + i) // ปรับช่วงปีให้แสดงปีปัจจุบันเป็นปีสุดท้าย
const router = useRouter()
const dialogAdd = ref(false) // สถานะการแสดง Dialog
const newFaculty = ref('') // ชื่อคณะใหม่
const newId = ref(0) // งบประมาณใหม่

const serverItems = ref([
  { id: 1, faculty: 'คณะดนตรีและการแสดง', budget: 50000 },
  { id: 2, faculty: 'คณะบริหารธุรกิจ', budget: 70000 },
  { id: 3, faculty: 'คณะพยาบาลศาสตร์', budget: 60000 },
  { id: 4, faculty: 'คณะภูมิสารสนเทศศาสตร์', budget: 50000 },
  { id: 5, faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์', budget: 70000 },
  { id: 6, faculty: 'คณะรัฐศาสตร์และนิติศาสตร์', budget: 60000 },
  { id: 7, faculty: 'คณะวิทยาการสารสนเทศ', budget: 50000 },
  { id: 8, faculty: 'คณะวิทยาศาสตร์', budget: 70000 },
  { id: 9, faculty: 'คณะวิทยาศาสตร์การกีฬา', budget: 60000 },
  { id: 10, faculty: 'คณะวิทยาศาสตร์และศิลปศาสตร์', budget: 70000 },
  { id: 11, faculty: 'คณะวิทยาศาสตร์และสังคมศาสตร์', budget: 60000 },
])

const headers = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'คณะ', key: 'faculty' },
  { title: 'งบประมาณ', key: 'budget', align: 'end' },
]

const totalBudget = computed(() => {
  return serverItems.value.reduce((sum, item) => sum + item.budget, 0).toLocaleString()
})

const onClickEdit = () => {
  router.push({ name: 'manageBudgetEditAdmin' })
}

const onClickAdd = () => {
  dialogAdd.value = true // แสดง Dialog เมื่อคลิก Add
}

const onSaveNewItem = () => {
  // บันทึกข้อมูลใหม่
  console.log('บันทึกข้อมูลใหม่:', newFaculty.value, newBudget.value)
  dialogAdd.value = false // ปิด Dialog
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
</style>
