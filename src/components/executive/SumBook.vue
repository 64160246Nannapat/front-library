<template>
  <v-main style="height: 500px">
    <HomeExecutive />

    <v-main>
      <v-container>
        <v-row class="align-center justify-space-between header-row">
          <div class="header">
            <img class="header-image" src="@/assets/sumbook.png" alt="Sum Image" />
            <h1>สรุปการซื้อหนังสือ</h1>
          </div>

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

const totalPrice = computed(() => items.reduce((sum, item) => sum + item.price, 0))
const totalBooks = computed(() => items.reduce((sum, item) => sum + item.quantity, 0))

const onDateSelected = (date: string) => {
  selectedDate.value = date
  formattedDate.value = new Date(date).toLocaleDateString('th-TH')
}
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between; /* จัดระยะห่างระหว่างหัวข้อและ date */
  margin-bottom: 30px; /* ระยะห่างระหว่างส่วนนี้กับส่วนถัดไป */
}

.header {
  display: flex;
  align-items: center;
  gap: 15px;
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

.date-status-row {
  margin-bottom: 20px;
}

/* เลือกวันที่และข้อมูลในตารางวันที่*/
.custom-date-picker {
  border: 2px solid #000; /* กรอบสีดำ */
  border-radius: 12px; /* มุมโค้ง */
  background-color: #fff; /* พื้นหลังขาว */
  cursor: pointer;
  font-size: 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  overflow: visible;
  padding-left: 10px;
}

.custom-width {
  width: 250px;
}

.custom-date-picker:hover {
  border-color: #707478; /* เปลี่ยนสีกรอบตอนชี้ */
}

/* ข้อความในกรอบ */
.custom-date-picker input {
  font-size: 18px; /* ขนาดข้อความ */
  border: none; /* ลบเส้นขอบของ input */
  outline: none; /* ลบเส้นโฟกัส */
  width: 100%; /* ให้ข้อความใช้พื้นที่เต็ม */
  height: 100%; /* ให้ข้อความครอบคลุมความสูง */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
  background-color: transparent;
  white-space: nowrap; /* ป้องกันการหักบรรทัด */
  overflow: visible; /* ป้องกันการแสดงข้อความเกินกรอบ */
  padding: 0; /* ลบระยะห่างใน input */
}

.v-date input {
  outline: none;
}

.custom-textdate {
  font-size: 20px; /* ขนาดข้อความ */
  border: none; /* ลบเส้นขอบ */
  outline: none; /* ลบเส้นโฟกัส */
  width: 100%; /* ให้ข้อความใช้พื้นที่เต็ม */
  height: 100%; /* ให้ข้อความครอบคลุมความสูง */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
  background-color: transparent;
  white-space: normal; /* ป้องกันการหักบรรทัด */
  overflow: visible;
}

/* ตาราง */
.v-simple-table {
  width: auto; /* ให้ตารางขยายตามเนื้อหา */
  max-width: 80%; /* จำกัดขนาดสูงสุด */
  margin: 0 auto; /* จัดให้อยู่กลาง */
  border-radius: 8px; /* มุมโค้ง */
  overflow: hidden; /* ป้องกันการล้น */
}

th,
td {
  padding: 16px;
  text-align: left;
  text-align: center; /* จัดข้อความในตารางให้อยู่ตรงกลาง */
  vertical-align: middle; /* จัดให้อยู่กลางในแนวตั้ง */
}

th {
  font-weight: bold;
  font-size: 20px;
}

.table-width {
  width: 200px;
  align-items: center; /* จัดให้อยู่กึ่งกลางในแนวตั้ง */
  justify-content: center; /* จัดให้อยู่กึ่งกลางในแนวนอน */
}
</style>
