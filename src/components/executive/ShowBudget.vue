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
              'วิทยาการคอมพิวเตอร์',
              'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
              'วิศวกรรมซอฟต์แวร์',
              'ปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ',
              'วิทยาการข้อมูล',
            ]"
            v-model="searchFaculty"
            class="select-book"
            variant="outlined"
            rounded="lg"
            multiple
            chips
            clearable
            closable-chips
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
        class="table"
        :items-per-page="10"
        show-current-page
      >
        <!-- Footer Summary Row -->
        <template v-slot:body.append>
          <tr class="font-weight-bold">
            <td colspan="3" class="text-right">รวม</td>
            <td class="text-center">{{ totalBudget }}</td>
            <td class="text-center">{{ totalUsed }}</td>
            <td class="text-center">{{ totalRemain }}</td>
          </tr>
        </template>
      </v-data-table>

      <v-btn
        variant="text"
        @click="goToSumBudExecutive"
        style="
          background-color: #4682b4; /* พื้นหลัง Steel Blue */
          border-radius: 8px;
          padding: 5px 15px;
          min-width: 100px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
        "
      >
        <v-icon>mdi-arrow-left</v-icon>
        <span>BACK</span>
      </v-btn>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import BuuLogo from '@/assets/Buu-logo11.png'

const searchFaculty = ref([])
const loading = ref(false)
const serverItems = ref([])
const router = useRouter()

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
    .reduce((sum, item) => sum + parseFloat(item.budget.replace(/,/g, '')) || 0, 0)
    .toLocaleString()
})

const totalUsed = computed(() => {
  return serverItems.value
    .reduce((sum, item) => sum + parseFloat(item.usebudget.replace(/,/g, '')) || 0, 0)
    .toLocaleString()
})

const totalRemain = computed(() => {
  return serverItems.value
    .reduce((sum, item) => sum + parseFloat(item.remain.replace(/,/g, '')) || 0, 0)
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
        name: 'ผศ.ดร.พิเชษ วะยะลุน',
        faculty: 'วิทยาการคอมพิวเตอร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 3,
        name: 'ผศ.เบญจภรณ์ จันทรกองกุล',
        faculty: 'วิทยาการคอมพิวเตอร์',
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
        faculty: 'วิทยาการคอมพิวเตอร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 6,
        name: 'ผศ.ดร.โกเมศ อัมพวัน',
        faculty: 'วิทยาการคอมพิวเตอร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 7,
        name: 'ดร.วรัณรัชญ์ วิริยะวิทย์',
        faculty: 'วิทยาการคอมพิวเตอร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 8,
        name: 'ผศ.ดร.อังศุมาลี สุทธภักติ',
        faculty: 'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 9,
        name: 'ผศ.เอกภพ บุญเพ็ง',
        faculty: 'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 10,
        name: 'อาจารย์เหมรัศมิ์ วชิรหัตถพงศ์',
        faculty: 'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 11,
        name: 'อาจารย์วิทวัส พันธุมจินดา',
        faculty: 'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 12,
        name: 'ดร. คนึงนิจ กุโบลา',
        faculty: 'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 13,
        name: 'ผศ.ดร.ประจักษ์ จิตเงินมะดัน',
        faculty: 'เทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 14,
        name: 'ดร.กามาล บาฮะ',
        faculty: 'วิทยเทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัลการคอมพิวเตอร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 15,
        name: 'อาจารย์สิทธิศักดิ์ แซ่จึง',
        faculty: 'วิทยเทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัลการคอมพิวเตอร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 16,
        name: 'ผศ.พีระศักดิ์ เพียรประสิทธิ์',
        faculty: 'วิศวกรรมซอฟต์แวร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 17,
        name: 'ผศ.ดร.อธิตา อ่อนเอื้อน',
        faculty: 'วิศวกรรมซอฟต์แวร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 18,
        name: 'ผศ.วันทนา ศรีสมบูรณ์',
        faculty: 'วิศวกรรมซอฟต์แวร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 19,
        name: 'ผศ.ดร.ณัฐพร ภักดี',
        faculty: 'วิศวกรรมซอฟต์แวร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 20,
        name: 'อาจารย์อริย์ธัช ศิรภัทร์วงศ์กร',
        faculty: 'วิศวกรรมซอฟต์แวร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 21,
        name: 'อาจารย์จิรายุส อาบกิ่ง',
        faculty: 'วิศวกรรมซอฟต์แวร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 22,
        name: 'ดร.ธนินทร์ เมธิโยธิน',
        faculty: 'วิศวกรรมซอฟต์แวร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 23,
        name: 'อาจารย์วิทวัส พันธุมจินดา',
        faculty: 'วิศวกรรมซอฟต์แวร์',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 24,
        name: 'ดร.พลวัต ช่อผูก',
        faculty: 'ปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 25,
        name: 'อาจารย์ประวิทย์ บุญมี',
        faculty: 'ปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 26,
        name: 'ผศ.ดร.สุภาวดี ศรีคำดี',
        faculty: 'ปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 27,
        name: 'รศ.ดร.กฤษณะ ชินสาร',
        faculty: 'ปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 28,
        name: 'ดร.วัชรพงศ์ อยู่ขวัญ',
        faculty: 'ปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 29,
        name: 'รศ.ดร.สุนิสา ริมเจริญ',
        faculty: 'วิทยาการข้อมูล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 30,
        name: 'ผศ.ดร.จักริน สุขสวัสดิ์ชน',
        faculty: 'วิทยาการข้อมูล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 31,
        name: 'รศ.ดร.ณัฐนนท์ ลีลาตระกูล',
        faculty: 'วิทยาการข้อมูล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
      {
        id: 32,
        name: 'ผศ.ดร.อุรีรัฐ สุขสวัสดิ์ชน',
        faculty: 'วิทยาการข้อมูล',
        budget: '50,000',
        usebudget: '20,000',
        remain: '30,000',
      },
    ]

    // กรองข้อมูลตามคณะที่เลือก
    if (searchFaculty.value.length > 0) {
      serverItems.value = data.filter((item) => searchFaculty.value.includes(item.faculty))
    } else {
      serverItems.value = data
    }

    loading.value = false
  }, 500)
}

const onSearch = () => {
  FakeAPI()
}

const goToSumBudExecutive = () => {
  router.push({ name: 'sumBudgetExecutive' })
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
