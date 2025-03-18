<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container class="budget-summary-container" fluid>
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
            <h3 style="margin-left: 76px">สาขา วิทยาการคอมพิวเตอร์</h3>
          </v-row>
        </v-col>

        <v-col cols="12" md="6" class="d-flex justify-end">
          <v-card class="summary-card">
            <v-card-title class="summary-title">งบประมาณรวม</v-card-title>
            <v-card-subtitle class="summary-amount">500,000 บาท</v-card-subtitle>
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
            multiple
            chips
            closable-chips
            clearable
            @update:modelValue="onSearch"
          />
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
        <template v-slot:body.append>
          <tr class="font-weight-bold">
            <td colspan="3" class="text-right">รวม</td>
            <td class="text-center">{{ totalBudget }}</td>
            <td class="text-center">{{ totalUsed }}</td>
            <td class="text-center">{{ totalRemain }}</td>
          </tr>
        </template>
      </v-data-table>

      <v-row justify="start" class="mt-4">
        <v-btn @click="goTosumBudFaculty" color="#A67B5B">BACK</v-btn>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchFaculty = ref(['ทั้งหมด'])
const loading = ref(false)
const serverItems = ref([])

const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'รายชื่อ', key: 'name' },
  { title: 'สาขา', key: 'faculty' },
  { title: 'งบประมาณที่ให้', key: 'budget', align: 'center' },
  { title: 'งบประมาณที่ใช้', key: 'usebudget', align: 'center' },
  { title: 'คงเหลือ', key: 'remain', align: 'center' },
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

const goTosumBudFaculty = () => {
  router.push({ name: 'sumBudFaculty' })
}

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
        name: 'ผศ.ดร.พิเชษ วะยะลุน',
        faculty: 'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 3,
        name: 'ผศ.เบญจภรณ์ จันทรกองกุล',
        faculty: 'วิทยาการช้อมูล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 4,
        name: 'ผศ.ภูสิต กุลเกษม',
        faculty: 'วิทยาการคอมพิวเตอร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 5,
        name: 'ผศ.จรรยา อ้นปันส์',
        faculty: 'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 6,
        name: 'ผศ.ดร.โกเมศ อัมพวัน',
        faculty: 'วิทยาการช้อมูล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 7,
        name: 'ดร.วรัณรัชญ์ วิริยะวิทย์',
        faculty: 'วิทยาการช้อมูล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
    ]

    // กรองตามรายการที่เลือก
    if (searchFaculty.value.includes('ทั้งหมด') || searchFaculty.value.length === 0) {
      serverItems.value = data
    } else {
      serverItems.value = data.filter((item) => searchFaculty.value.includes(item.faculty))
    }

    loading.value = false
  }, 500)
}

const onSearch = () => {
  FakeAPI()
}

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
