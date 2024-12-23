<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/book (1).png" alt="Library Image" />
        <h1>จัดการหนังสือ</h1>

        <v-row align="center" class="date-status-row" justify="end">
          <v-col cols="auto">
            <v-file-input
              v-model="uploadedFile"
              label="อัปโหลดไฟล์ Excel"
              accept=".xls, .xlsx, .csv"
              class="file-upload"
              variant="outlined"
              show-size
              clearable
            />
          </v-col>
        </v-row>
      </div>

      <!-- ตารางข้อมูล -->
      <v-data-table
        :headers="headers"
        :items="serverItems"
        :loading="loading"
        show-items-per-page="false"
        :hide-default-footer="true"
      />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as XLSX from 'xlsx'

const loading = ref(false)
const uploadedFile = ref<File | null>(null)

const handleFileUpload = () => {
  if (uploadedFile.value) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(sheet)
      console.log('ข้อมูลจาก Excel:', jsonData)
    }
    reader.readAsArrayBuffer(uploadedFile.value)
  }
}

// ข้อมูลหนังสือแบบคงที่
const serverItems = ref([
  {
    id: 1,
    title: 'หนังสือ A',
    isbn: '978-3-16-148410-0',
    price: 250,
    quantity: 2,
  },
  {
    id: 2,
    title: 'หนังสือ B',
    isbn: '978-0-306-40615-7',
    price: 350,
    quantity: 1,
  },
  {
    id: 3,
    title: 'หนังสือ C',
    isbn: '978-1-4028-9462-6',
    price: 500,
    quantity: 3,
  },
  {
    id: 4,
    title: 'ความรู้สึกของเราสำคัญที่สุด',
    isbn: '978-1-4028-9462-6',
    price: 500,
    quantity: 1,
  },
  {
    id: 5,
    title: 'คุณคางคกไปพบนักจิตบำบัด',
    isbn: '978-1-4028-9462-6',
    price: 500,
    quantity: 1,
  },
])

// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ชื่อหนังสือ', key: 'title' },
  { title: 'ISBN', key: 'isbn' },
  { title: 'ราคาสุทธิ', key: 'price' },
  { title: 'จำนวน', key: 'quantity' },
]
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

.date-status-row {
  margin-bottom: 20px;
}

/* เลือกวันที่และข้อมูลในตารางวันที่ */
.custom-date-picker {
  font-size: 20px;
  white-space: nowrap; /* ห้ามตัดข้อความขึ้นบรรทัดใหม่ */
  overflow: visible; /* แสดงข้อความที่เกิน */
  text-overflow: unset; /* ปิด ellipsis (...) */
  width: 100px;
  min-width: 300px;
  text-align: center; /* จัดข้อความอยู่กลาง */
  justify-content: center;
  align-content: center;
}

.v-input--is-prepended .v-input__prepend-inner-icon {
  font-size: 28px; /* ขนาดไอคอน */
}

.v-input--is-prepended.v-input--has-icon.v-input--is-dirty .v-input__prepend-inner-icon {
  font-size: 28px; /* ไอคอนขนาดใหญ่เมื่อ input มีค่าเปลี่ยนแปลง */
}

.custom-border {
  border-radius: 15px; /* ทำให้มุมโค้ง */
  padding: 4px 8px; /* เพิ่มพื้นที่ภายในให้ข้อความไม่ชิดขอบ */
  box-sizing: border-box; /* ให้ padding ไม่กระทบกับความกว้าง */
}

.custom-width {
  width: 250px; /* กำหนดความกว้างของ input */
}

.custom-date-picker:hover {
  border-color: #707478; /* เปลี่ยนสีกรอบตอนชี้ */
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
  width: 100%; /* ขยายตารางให้เต็มความกว้างคอนเทนเนอร์ */
  max-width: 100%; /* กำหนดให้ไม่เกินความกว้างของหน้าจอ */
  margin: 0 auto; /* จัดตารางให้อยู่กลางหน้าจอ */
  font-size: 18px;
  border-collapse: collapse; /* รวมเส้นขอบตาราง */
  overflow-x: auto;
  table-layout: auto; /* ช่วยให้ตารางขยายได้ตามขนาดข้อมูล */
}

th,
td {
  padding: 16px;
  text-align: left;
  width: 16%; /* ปรับความกว้างให้แต่ละคอลัมน์สมดุล */
}

th {
  font-weight: bold;
  font-size: 20px;
}

.formatted-date-display {
  text-align: center;
  margin-bottom: 20px;
}

.formatted-date-display h2 {
  font-size: 20px;
  font-weight: bold;
  color: #4e484a;
}

.file-upload {
  width: 250px;
}
</style>
