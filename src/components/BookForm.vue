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
          <!-- คำนำหน้าชื่อ -->
          <div class="form-row">
            <label for="name">คำนำหน้า:</label>
            <v-text-field
              v-model="book.Prefix"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ชื่อ -->
          <div class="form-row">
            <label for="name">ชื่อผู้เสนอ:</label>
            <v-text-field
              v-model="book.Name"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ตำแหน่ง -->
          <div class="form-row">
            <label for="role">ตำแหน่ง:</label>
            <v-select
              v-model="book.Role"
              :items="roles"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-select>
          </div>

          <!-- คณะ -->
          <div class="form-row">
            <label for="faculty">คณะ:</label>
            <v-select
              v-model="book.Faculty"
              :items="faculty"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-select>
          </div>

          <!-- สาขา -->
          <div class="form-row">
            <label for="major">สาขา:</label>
            <v-select
              v-model="book.Major"
              :items="major"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-select>
          </div>

          <!-- เบอร์ -->
          <div class="form-row">
            <label for="phone">เบอร์:</label>
            <v-text-field
              v-model="book.Phone"
              :rules="[rules.required, rules.phone]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- E-mail -->
          <div class="form-row">
            <label for="email">E-mail:</label>
            <v-text-field
              v-model="book.Email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ชื่อร้านค้า (Dropdown) -->
          <div class="form-row">
            <label for="store">ชื่อร้านค้า:</label>
            <v-select
              v-model="book.Store"
              :items="stores"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-select>
          </div>

          <!-- ชื่อหนังสือ -->
          <div class="form-row">
            <label for="title">ชื่อหนังสือ:</label>
            <v-text-field
              v-model="book.Title"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ผู้แต่ง -->
          <div class="form-row">
            <label for="author">ผู้ชื่อแต่ง:</label>
            <v-text-field
              v-model="book.Author"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ปีพิมพ์ -->
          <div class="form-row">
            <label for="year">ปีพิมพ์:</label>
            <v-text-field
              v-model="book.Year"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ISBN -->
          <div class="form-row">
            <label for="isbn">ISBN:</label>
            <v-text-field
              v-model="book.isbn"
              :rules="[rules.required, rules.isbn]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- รายวิชา -->
          <div class="form-row">
            <label for="subject">รายวิชา:</label>
            <v-text-field
              v-model="book.Subject"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ราคาสุทธิ -->
          <div class="form-row">
            <label for="price">ราคาสุทธิ:</label>
            <v-text-field
              v-model="book.Price"
              :rules="[rules.required, rules.number]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- จำนวนเล่ม -->
          <div class="form-row">
            <label for="count">จำนวนเล่ม:</label>
            <v-text-field
              v-model="book.Count"
              :rules="[rules.required, rules.number]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ปุ่มยืนยัน -->
          <v-btn
            :disabled="!valid"
            elevation="8"
            class="mt-4 confirm-btn confirm-btnheight"
            style="background-color: #eed3d9"
            @click="submitForm(bookForm)"
          >
            ยืนยัน
          </v-btn>
        </v-form>

        <!-- Success Message -->
        <v-alert v-if="submitted" type="success" dismissible class="mt-3">
          ส่งข้อมูลสำเร็จ!
        </v-alert>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeStudent from '@/components/student/HomeStudent.vue'

const bookForm = ref(null)
const formValid = ref(false)
const submitted = ref(false)
// ข้อมูลในฟอร์ม
const book = ref({
  Prefix: '',
  Name: '',
  Role: '',
  Faculty: '',
  Phone: '',
  Major: '',
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
  number: (value: string) => /^[1-9]+$/.test(value) || 'ต้องเป็นตัวเลขเท่านั้น',
}

const submitForm = (bookForm: any) => {
  const invalidFields = bookForm.validate() // ตรวจสอบข้อผิดพลาดของฟอร์ม

  if (invalidFields.length > 0) {
    formValid.value = false // ไม่แสดง valid (ข้อความ error) หากยังมีข้อผิดพลาด
  } else {
    submitted.value = true // ตั้งค่าให้ฟอร์มถูกส่งข้อมูลแล้ว
    resetForm(bookForm) // รีเซ็ตฟอร์มหลังจากส่งสำเร็จ
  }
}

const resetForm = (bookForm: any) => {
  book.value = {
    Prefix: '',
    Name: '',
    Role: '',
    Faculty: '',
    Phone: '',
    Major: '',
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
  formValid.value = false // ปิดการแสดง valid หลังจากรีเซ็ตฟอร์ม
  bookForm.reset() // รีเซ็ตฟอร์ม
  bookForm.clearValidation() // ล้างข้อผิดพลาดของฟิลด์
  submitted.value = false // ไม่แสดงข้อความสำเร็จอีกครั้งหลังจากรีเซ็ตฟอร์ม
}

const stores = ['ร้าน A', 'ร้าน B', 'ร้าน C']
const roles = ['อาจารย์', 'นิสิต', 'บุคลากร', 'นักวิจัย']
const faculty = ['คณะวิทยาศาสตร์', 'คณะบริหาร', 'คณะวิทยาการสารสนเทศ', 'คณะวิศวกรรมศาสตร์']
const major = [
  'สาขาวิชาวิทยาการคอมพิวเตอร์',
  'สาขาวิชาเทคโนโลยีสารสนเทศเพื่ออุตสาหกรรมดิจิทัล',
  'สาขาวิชาวิศวกรรมซอฟต์แวร์',
  'สาขาวิชาปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ',
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

.v-container {
  margin-top: 20px;
}

/* จัดรูปแบบให้ข้อความและช่องกรอกข้อมูลอยู่แถวเดียวกัน */
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 20px;
  justify-content: space-between;
}

.form-row label {
  min-width: 120px; /* กำหนดความกว้างขั้นต่ำให้ข้อความ */
  margin-right: 10px;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  font-size: 20px;
}

.text-feild-top {
  margin-top: 20px;
  min-height: 50px;
}

.v-text-field,
.v-select {
  flex-grow: 1; /* ให้ช่องกรอกข้อมูลขยายตามพื้นที่ที่เหลือ */
}

.confirm-btn {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
  margin-left: auto;
  transition: background-color 0.3s ease; /* เพิ่ม transition เพื่อเปลี่ยนสีที่เรียบง่าย */
}

.confirm-btnheight {
  width: 150px;
  height: 50px;
}
</style>
