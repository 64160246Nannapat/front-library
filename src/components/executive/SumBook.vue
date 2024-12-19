<template>
  <v-main style="height: 500px">
    <HomeExecutive />

    <v-main>
      <v-container>
        <v-row class="align-center">
          <div class="header">
            <img class="header-image" src="@/assets/sumbook.png" alt="Sum Image" />
            <h1>สรุปการซื้อหนังสือ</h1>
          </div>
          <v-col cols="12" sm="6" class="text-end">
            <v-menu
              v-model="menuDate"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="formattedDate"
                  readonly
                  label="เลือกวันที่"
                  v-bind="attrs"
                  v-on="on"
                  dense
                ></v-text-field>
              </template>
              <v-date-picker v-model="selectedDate" @input="onDateSelected"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <v-select v-model="faculty" :items="faculties" label="คณะ" dense></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select v-model="status" :items="statuses" label="สถานะ" dense></v-select>
          </v-col>
        </v-row>

        <v-data-table :headers="headers" :items="items" item-value="name" class="elevation-1">
        </v-data-table>

        <v-row class="mt-4">
          <v-col cols="6" class="text-start">
            รวม: <b>{{ totalPrice }}</b> บาท
          </v-col>
          <v-col cols="6" class="text-end">
            จำนวน: <b>{{ totalBooks }}</b> เล่ม
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HomeExecutive from '@/components/executive/HomeExecutive.vue'

const menuDate = ref(false)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const formattedDate = ref(new Date().toLocaleDateString('th-TH'))
const faculty = ref('ทั้งหมด')
const status = ref('ทั้งหมด')

const faculties = ['ทั้งหมด', 'วิทยาการสารสนเทศ', 'วิทยาศาสตร์', 'บริหาร', 'วิศวกรรมศาสตร์']
const statuses = ['ทั้งหมด', 'มีคูปอง', 'ไม่มีผู้คูปอง']

const items = [
  {
    rank: 1,
    name: 'ปรัชญาชีวิต',
    isbn: '9786160631308',
    store: 'แจ่มใส',
    price: 415,
    quantity: 1,
    status: 'มีผู้จอง',
    faculty: 'วิทยาการสารสนเทศ',
  },
  {
    rank: 2,
    name: 'หัวไม่ดีหัวร้อนอ่านหน้า',
    isbn: '9786165786195',
    store: 'MD',
    price: 245,
    quantity: 1,
    status: 'ไม่มีผู้จอง',
    faculty: 'วิทยาการสารสนเทศ',
  },
]

const headers = [
  { text: 'ลำดับ', value: 'rank' },
  { text: 'ข้อมูลหนังสือ', value: 'name' },
  { text: 'ISBN', value: 'isbn' },
  { text: 'ร้านค้า', value: 'store' },
  { text: 'ราคา (บาท)', value: 'price' },
  { text: 'จำนวน (เล่ม)', value: 'quantity' },
  { text: 'สถานะ', value: 'status' },
  { text: 'คณะ', value: 'faculty' },
]

const search = ref('')

const totalPrice = computed(() => items.reduce((sum, item) => sum + item.price, 0))
const totalBooks = computed(() => items.reduce((sum, item) => sum + item.quantity, 0))

const onDateSelected = (date: string) => {
  selectedDate.value = date
  formattedDate.value = new Date(date).toLocaleDateString('th-TH')
}
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

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin: 0;
}

.v-container {
  margin-top: 80px;
}

.v-main {
  margin-top: 96px; /* ปรับให้เหมาะสมกับ v-app-bar สูง 96px */
  padding: 20px;
}

.magin-top {
  padding-top: 50px;
}
</style>
