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
            <h3 style="margin-left: 76px">สาขา วิทยาการคอมพิวเตอร์</h3>
          </v-row>
        </v-col>

        <v-col cols="12" md="6" class="d-flex justify-end">
          <v-card class="summary-card">
            <v-card-title class="summary-title">งบประมาณรวม</v-card-title>
            <v-card-subtitle class="summary-amount">50,000 บาท</v-card-subtitle>
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
        :items="filteredItems"
        :loading="loading"
        item-key="id"
        class="budget-table"
        :hide-default-footer="true"
        :items-per-page="-1"
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
  <v-dialog v-model="dialogAdd" max-width="400px" class="dialog-container">
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
          @click="dialogAdd = false"
          color="red"
          class="cursor-pointer"
          style="font-size: 35px"
        >
          mdi-close
        </v-icon>
      </v-card-title>

      <!-- เนื้อหาของ Dialog -->
      <v-card-text class="pt-4">
        <div class="form-row" style="display: flex; align-items: center; gap: 8px">
          <label for="name" style="font-size: 18px; width: 50px">ID:</label>
          <v-text-field
            v-model="newId"
            variant="outlined"
            dense
            style="flex: 1; margin-bottom: -15px"
          ></v-text-field>
        </div>

        <div
          class="form-row"
          style="display: flex; align-items: center; gap: 8px; margin-top: 12px"
        >
          <label for="faculty" style="font-size: 18px; width: 50px">ชื่อ:</label>
          <v-text-field
            v-model="newFaculty"
            variant="outlined"
            dense
            style="flex: 1; margin-bottom: -15px"
          ></v-text-field>
        </div>
      </v-card-text>

      <!-- ปุ่มบันทึก -->
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(false)
const selectedYear = ref<number | null>(null)
const currentYear = new Date().getFullYear() + 543 // ปีปัจจุบันใน พ.ศ.
const years = Array.from({ length: currentYear - 2517 }, (_, i) => 2518 + i) // ช่วงปี พ.ศ. (เริ่มที่ 2518)
const router = useRouter()
const dialogAdd = ref(false) // สถานะการแสดง Dialog
const newFaculty = ref('') // ชื่อคณะใหม่
const newId = ref('') // ID ใหม่
const updatedData = ref([])
const searchText = ref('')

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

const totalBudget = computed(() => {
  return filteredItems.value
    .reduce((sum, item) => {
      // แปลงค่า budget เป็นตัวเลข หากไม่ใช่ตัวเลข
      const budget = parseFloat(item.budget) || 0
      return sum + budget
    }, 0)
    .toLocaleString()
})

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

const onClickEdit = () => {
  router.push({ name: 'ManageEditBudDeFaculty' })
}

const onClickAdd = () => {
  dialogAdd.value = true // แสดง Dialog เมื่อคลิก Add
}

const onSaveNewItem = () => {
  // บันทึกข้อมูลใหม่
  console.log('บันทึกข้อมูลใหม่:', newFaculty.value, newId.value)
  dialogAdd.value = false // ปิด Dialog
}

const onYearChange = (year: number | null) => {
  console.log('ปีที่เลือก:', year)
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
  selectedYear.value = currentYear
  if (router.currentRoute.value.state?.updatedData) {
    updatedData.value = router.currentRoute.value.state.updatedData
  }
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
