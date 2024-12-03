<template>
  <v-main style="height: 500px">
    <HomeStudent />

    <v-main>
      <v-container>
        <div class="header">
          <img class="header-image" src="@/assets/library (1).png" alt="Library Image" />
          <h1>แบบฟอร์มการเสนอหนังสือ</h1>
        </div>
        <v-form ref="bookForm" v-model="valid">
          <v-text-field
            label="ชื่อผู้เสนอ"
            v-model="formData.Name"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-text-field
            label="ตำแหน่ง"
            v-model="formData.Role"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-text-field
            label="คณะ"
            v-model="formData.Faculty"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-text-field
            label="สาขา"
            v-model="formData.Course"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-text-field
            label="เบอร์"
            v-model="formData.Phone"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-text-field
            label="E-mail"
            v-model="formData.Email"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-select
            label="ชื่อร้านค้า"
            v-model="formData.selectedStore"
            :items="stores"
            :rules="[rules.required]"
            outlined
          ></v-select>

          <v-text-field
            label="ชื่อหนังสือ"
            v-model="formData.bookTitle"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-text-field label="ชื่อผู้แต่ง" v-model="formData.Author" outlined></v-text-field>

          <v-text-field label="ปีพิมพ์" v-model="formData.Year" outlined></v-text-field>

          <v-text-field
            label="ISBN"
            v-model="formData.isbn"
            :rules="[rules.required, rules.isbn]"
            outlined
          ></v-text-field>

          <v-text-field
            label="รายวิชา"
            v-model="formData.Subject"
            :rules="[rules.required]"
            outlined
          ></v-text-field>

          <v-text-field
            label="ราคาสุทธิ"
            v-model="formData.Price"
            :rules="[rules.required, rules.number]"
            outlined
          ></v-text-field>

          <v-text-field
            label="จำนวนเล่ม"
            v-model="formData.Count"
            :rules="[rules.required, rules.positiveNumber]"
            outlined
          ></v-text-field>

          <v-btn class="custom-btn mt-4" :disabled="!valid" @click="submitForm"> ยืนยัน </v-btn>
        </v-form>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeStudent from '@/components/student/HomeStudent.vue'

// ข้อมูลในฟอร์ม
const formData = ref({
  Name: '',
  Role: '',
  Faculty: '',
  Course: '',
  Phone: '',
  Email: '',
  selectedStore: '',
  bookTitle: '',
  Author: '',
  Year: '',
  isbn: '',
  Subject: '',
  Price: '',
  Count: '',
})

const stores = ['ร้าน A', 'ร้าน B', 'ร้าน C'] //ร้านค้า

//ตรวจสอบว่าต้องกรอก
const valid = ref(false)
const rules = {
  required: (value: string) => !!value || 'ต้องกรอกข้อมูล',
  isbn: (value: string) =>
    /^97[89][-\s]?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?\d$/.test(value) ||
    'รูปแบบ ISBN ไม่ถูกต้อง',
  number: (value: string) => /^\d+$/.test(value) || 'ข้อมูลไม่ถูกต้อง', //กำหนดให้กรอกแค่ตัวเลข
  positiveNumber: (value: string) => /^[1-9]\d*$/.test(value) || 'ข้อมูลไม่ถูกต้อง', //กำหนดให้มากกว่า 0 หรือไม่ติดลบ
}

//ส่งข้อมูล
const submitForm = () => {
  if (valid.value) {
    console.log('ข้อมูลฟอร์ม:', formData.value)
    alert('ส่งข้อมูลสำเร็จ!')

    //ล้างฟอร์ม
    formData.value = {
      Name: '',
      Role: '',
      Faculty: '',
      Course: '',
      Phone: '',
      Email: '',
      selectedStore: '',
      bookTitle: '',
      Author: '',
      Year: '',
      isbn: '',
      Subject: '',
      Price: '',
      Count: '',
    }

    valid.value = false
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-image {
  width: 60px; /* กำหนดความกว้างของรูป */
  height: auto; /* ให้ความสูงปรับตามสัดส่วน */
  margin-right: 15px;
}
h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin: 0;
}

.v-container {
  margin-top: 20px;
}

.custom-btn {
  background-color: #eed3d9 !important; /* ตั้งสีพื้นหลัง */
  color: #000000 !important; /* ตั้งสีตัวอักษร */
  font-size: 18px; /* ขนาดตัวอักษร */
  padding: 12px 24px; /* ขยายขนาดปุ่ม */
  border-radius: 8px; /* เพิ่มมุมโค้ง */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease; /* เพิ่มเอฟเฟกต์ */
  display: flex;
  justify-content: center; /* ทำให้ข้อความอยู่กลางปุ่ม */
  align-items: center; /* แนวตั้งให้ข้อความอยู่กลาง */
  width: auto; /* ความกว้างของปุ่มจะปรับตามขนาดเนื้อหาภายใน */
  justify-content: flex-start;
}

.custom-btn:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* เงาเมื่อ Hover */
  transform: translateY(-2px); /* เลื่อนขึ้นเล็กน้อย */
}

.custom-btn:disabled {
  background-color: #ccc !important; /* สีเมื่อปุ่ม Disabled */
  color: #777 !important;
  box-shadow: none; /* ปิดเงาเมื่อ Disabled */
}
</style>
