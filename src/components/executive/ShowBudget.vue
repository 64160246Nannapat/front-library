<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container class="budget-summary-container">
      <!-- Header -->
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6">
          <v-row>
            <div class="header">
              <img class="header-image" src="@/assets/salary (1).png" alt="Budget Image" />
              <h1 style="font-size: 25px">สรุปงบประมาณ</h1>
            </div>
          </v-row>
          <v-row>
            <h3 style="margin-left: 76px">คณะ วิทยาการสารสนเทศ</h3>
          </v-row>
        </v-col>

        <v-col cols="12" md="6" class="d-flex justify-end">
          <v-card class="summary-card">
            <v-card-title class="summary-title">งบประมาณรวม</v-card-title>
            <v-card-subtitle class="summary-amount">200,000 บาท</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filter Dropdown -->
      <v-row>
        <v-col cols="auto" class="d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">สาขา:</h3>
          <v-select
            :items="[
              'ทั้งหมด',
              'วิทยาการคอมพิวเตอร์',
              'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
              'วิศวกรรมซอฟต์แวร์',
              'ปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ',
              'วิทยาการช้อมูล',
            ]"
            v-model="searchFaculty"
            class="select-book"
            variant="outlined"
            rounded="lg"
            @input="onSearch"
          ></v-select>
        </v-col>
      </v-row>

      <!-- ตารางข้อมูล -->
      <v-data-table
        :headers="headers"
        :items="serverItems"
        :loading="loading"
        item-key="id"
        :hide-default-footer="true"
        class="table"
        :items-per-page="-1"
      >
      </v-data-table>

      <v-divider></v-divider>

      <!-- Summary Row -->
      <v-row class="summary-row">
        <v-col cols="12">
          <div class="summary-total">
            <span>รวม</span>
            <span style="margin-left: 430px">{{ totalBudget }} </span>
            <span style="margin-right: -5px">{{ totalUsed }}</span>
            <span style="margin-right: 70px">{{ totalRemain }}</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const searchFaculty = ref('ทั้งหมด')
const loading = ref(false)
const serverItems = ref([])

const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ชื่อผู้ได้รับ', key: 'name' },
  { title: 'สาขา', key: 'faculty' },
  { title: 'งบประมาณที่ให้', key: 'budget' },
  { title: 'งบประมาณที่ใช้', key: 'usebudget' },
  { title: 'คงเหลือ', key: 'remain' },
]

const totalBudget = computed(() => {
  return serverItems.value
    .reduce((sum, item) => sum + parseFloat(item.budget.replace(/,/g, '')), 0)
    .toLocaleString()
})

const totalUsed = computed(() => {
  return serverItems.value
    .reduce((sum, item) => sum + parseFloat(item.usebudget.replace(/,/g, '')), 0)
    .toLocaleString()
})

const totalRemain = computed(() => {
  return serverItems.value
    .reduce((sum, item) => sum + parseFloat(item.remain.replace(/,/g, '')), 0)
    .toLocaleString()
})

const FakeAPI = () => {
  loading.value = true
  setTimeout(() => {
    const data = [
      {
        id: 1,
        name: 'อาจารย์วรวิทย์ วีระพันธุ์',
        faculty: 'วิทยาการคอมพิวเตอร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 2,
        name: 'อาจารย์เพทาย วรหัตถพงศ์',
        faculty: 'เทคโนโลยีสารสนเทศ',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 3,
        name: 'ผศ.ดร.จักริน สุขสวัสดิ์',
        faculty: 'วิทยาการข้อมูล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
    ]

    // กรองข้อมูลตามคณะที่เลือก
    if (searchFaculty.value !== 'ทั้งหมด') {
      serverItems.value = data.filter((item) => item.faculty === searchFaculty.value)
    } else {
      serverItems.value = data
    }

    loading.value = false
  }, 500)
}

const onSearch = () => {
  FakeAPI()
}

watch(searchFaculty, () => {
  onSearch() // เรียก `onSearch` ทันทีเมื่อ `searchFaculty` เปลี่ยนแปลง
})

// โหลดข้อมูลเริ่มต้น
onMounted(() => {
  FakeAPI()
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

.summary-row {
  margin-top: 10px;
  text-align: right;
  font-weight: bold;
  font-size: 16px;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-radius: 5px;
}

.select-book {
  width: 400px;
}
</style>
