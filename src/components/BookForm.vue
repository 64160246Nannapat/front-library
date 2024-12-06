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
          <!-- ชื่อ -->
          <div class="form-row">
            <label for="name">ชื่อผู้เสนอ:</label>
            <v-text-field
              id="name"
              v-model="formData.Name"
              :rules="[rules.required]"
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- ตำแหน่ง -->
          <div class="form-row">
            <label for="role">ตำแหน่ง:</label>
            <v-select
              id="role"
              v-model="formData.Role"
              :items="roles"
              :rules="[rules.required]"
              outlined
              dense
            ></v-select>
          </div>

          <!-- คณะ -->
          <div class="form-row">
            <label for="faculty">คณะ:</label>
            <v-text-field
              id="faculty"
              v-model="formData.Faculty"
              :rules="[rules.required]"
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- สาขา -->
          <div class="form-row">
            <label for="course">สาขา:</label>
            <v-text-field
              id="course"
              v-model="formData.Course"
              :rules="[rules.required]"
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- เบอร์ -->
          <div class="form-row">
            <label for="phone">เบอร์:</label>
            <v-text-field
              id="phone"
              v-model="formData.Phone"
              :rules="[rules.required, rules.phone]"
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- E-mail -->
          <div class="form-row">
            <label for="email">E-mail:</label>
            <v-text-field
              id="email"
              v-model="formData.Email"
              :rules="[rules.required, rules.email]"
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- ชื่อร้านค้า (Dropdown) -->
          <div class="form-row">
            <label for="store">ชื่อร้านค้า:</label>
            <v-select
              id="store"
              v-model="formData.Store"
              :items="stores"
              :rules="[rules.required]"
              outlined
              dense
            ></v-select>
          </div>

          <!-- ชื่อหนังสือ -->
          <div class="form-row">
            <label for="title">ชื่อหนังสือ:</label>
            <v-text-field
              id="title"
              v-model="formData.Title"
              :rules="[rules.required]"
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- ผู้แต่ง -->
          <div class="form-row">
            <label for="author">ผู้ชื่อแต่ง:</label>
            <v-text-field id="author" v-model="formData.Author" outlined dense></v-text-field>
          </div>

          <!-- ปีพิมพ์ -->
          <div class="form-row">
            <label for="year">ปีพิมพ์:</label>
            <v-text-field id="year" v-model="formData.Year" outlined dense></v-text-field>
          </div>

          <!-- ISBN -->
          <div class="form-row">
            <label for="isbn">ISBN:</label>
            <v-text-field
              id="isbn"
              v-model="formData.isbn"
              :rules="[rules.required, rules.isbn]"
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- รายวิชา -->
          <div class="form-row">
            <label for="subject">รายวิชา:</label>
            <v-text-field
              id="subject"
              v-model="formData.Subject"
              :rules="[rules.number]"
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- ราคาสุทธิ -->
          <div class="form-row">
            <label for="price">ราคาสุทธิ:</label>
            <v-select
              id="price"
              v-model="formData.Price"
              :rules="[rules.required, rules.number]"
              outlined
              dense
            ></v-select>
          </div>

          <!-- จำนวนเล่ม -->
          <div class="form-row">
            <label for="count">จำนวนเล่ม:</label>
            <v-text-field
              id="count"
              v-model="formData.Count"
              :rules="[rules.required, rules.number]"
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- ปุ่ม -->
          <v-btn class="custom-btn mt-4 confirm-btn" :color="'pink'" @click="submitForm">
            ยืนยัน
          </v-btn>
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
  Phone: '',
  Course: '',
  Email: '',
  Store: '',
  Title: '',
  Author: '',
  Year: '',
  isbn: '',
  Subject: '',
  Price: '',
  Count: '',
})

const valid = ref(false)
const rules = {
  required: (value: string) => {
    return !value ? 'ต้องกรอกข้อมูล' : true
  },
  email: (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'รูปแบบอีเมลไม่ถูกต้อง',
  phone: (value: string) => /^[0-9]{10}$/.test(value) || 'หมายเลขโทรศัพท์ต้องมี 10 หลัก',
  isbn: (value: string) => /^(97(8|9))?\d{9}(\d|X)$/.test(value) || 'รูปแบบ ISBN ไม่ถูกต้อง',
  number: (value: string) => /^[0-9]+$/.test(value) || 'ต้องเป็นตัวเลขเท่านั้น',
}

const submitForm = () => {
  const form = $refs.bookForm as any
  if (form.validate()) {
    console.log('ข้อมูลฟอร์ม:', formData.value)
    alert('ส่งข้อมูลสำเร็จ!')

    // ล้างข้อมูลฟอร์มหลังจากการส่ง
    formData.value = {
      Name: '',
      Role: '',
      Faculty: '',
      Phone: '',
      Course: '',
      Email: '',
      Store: '',
      Title: '',
      Author: '',
      Year: '',
      isbn: '',
      Subject: '',
      Price: '',
      Count: '',
    }

    // รีเซ็ตการตรวจสอบฟอร์ม
    valid.value = false

    // รีเซ็ตฟอร์มทั้งหมด (รวมทั้ง validation)
    form.reset()

    // เพิ่มการรีเซ็ตค่า valid ในฟอร์มเพื่อให้สามารถกรอกข้อมูลใหม่ได้
    valid.value = false
  }
}

const stores = ['ร้าน A', 'ร้าน B', 'ร้าน C']
const roles = ['อาจารย์', 'นิสิต', 'บุคลากร', 'นักวิจัย']
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
  margin-top: 20px;
}

/* จัดรูปแบบให้ข้อความและช่องกรอกข้อมูลอยู่แถวเดียวกัน */
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.form-row label {
  min-width: 120px; /* กำหนดความกว้างขั้นต่ำให้ข้อความ */
  margin-right: 10px;
  font-weight: bold;
  text-align: right;
}

.v-text-field,
.v-select {
  flex-grow: 1; /* ให้ช่องกรอกข้อมูลขยายตามพื้นที่ที่เหลือ */
}

.confirm-btn {
  width: 200px;
  height: 50px;
  font-size: 16px;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
  margin-left: auto;
  transition: background-color 0.3s ease; /* เพิ่ม transition เพื่อเปลี่ยนสีที่เรียบง่าย */
}
</style>
