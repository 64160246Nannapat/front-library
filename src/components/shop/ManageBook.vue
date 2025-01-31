<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/book (1).png" alt="Library Image" />
        <h1>จัดการหนังสือ</h1>

        <v-row align="center" class="date-status-row" justify="end">
          <v-col cols="auto">
            <!-- ปุ่มสำหรับเลือกไฟล์ -->
            <v-btn @click="triggerFileInput" style="background-color: #eed3d9">
              <span style="color: black; font-weight: bold">Upload File</span>
            </v-btn>
            <!-- Hidden file input -->
            <input
              ref="fileInput"
              type="file"
              accept=".xls, .xlsx, .csv"
              style="display: none"
              @change="handleFileChange"
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
        :items-per-page="-1"
      />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as XLSX from 'xlsx'

const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const serverItems = ref([])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    uploadedFile.value = file

    // อ่านไฟล์ Excel
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })

      // อ่านเฉพาะชีตแรก
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
      serverItems.value = jsonData.map((item: any, index: number) => ({
        id: index + 1,
        title: item['ชื่อหนังสือ'] || '',
        author: item['ชื่อผู้แต่ง'] || '',
        isbn: item['ISBN'] || '',
        price: item['ราคาสุทธิ'] || 0,
        subject: item['หมวดหมู่'] || '',
        published: item['สำนักพิมพ์'] || '',
        edition: item['ปีที่พิมพ์'] || '',
      }))
    }

    reader.readAsArrayBuffer(file)
  }
}

// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ชื่อหนังสือ', key: 'title' },
  { title: 'ชื่อผู้แต่ง', key: 'author' },
  { title: 'ISBN', key: 'isbn' },
  { title: 'ราคาสุทธิ', key: 'price' },
  { title: 'หมวดหมู่', key: 'subject' },
  { title: 'สำนักพิมพ์', key: 'published' },
  { title: 'ปีที่พิมพ์', key: 'edition' },
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

/* กำหนด style ของส่วนหัวตาราง */
th {
  font-weight: bold; /* ตัวหนังสือเป็นตัวหนา */
  font-size: 20px; /* ขนาดตัวอักษร */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
  background-color: #f5f5f5; /* พื้นหลังสีอ่อน */
  color: #333; /* สีตัวอักษร */
  padding: 16px; /* เพิ่มช่องว่างในเซลล์ */
  border-bottom: 2px solid #ccc; /* เส้นขอบล่าง */
}

/* กำหนด style ของข้อมูลในตาราง */
td {
  font-weight: normal; /* ตัวหนังสือปกติ */
  font-size: 18px; /* ขนาดตัวอักษร */
  text-align: left; /* จัดข้อความชิดซ้าย */
  padding: 16px; /* เพิ่มช่องว่างในเซลล์ */
  border-bottom: 1px solid #ddd; /* เส้นขอบล่าง */
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

.v-data-table th {
  white-space: nowrap; /* ป้องกันการขึ้นบรรทัดใหม่ */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
}

th:nth-child(2) {
  white-space: nowrap;
}
</style>
