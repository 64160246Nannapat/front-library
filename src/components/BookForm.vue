<template>
  <v-main style="height: 500px; margin-top: -60px">
    <!-- <HomeStudent /> -->
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

          <div class="form-row">
            <v-radio-group inline :rules="[rules.required, rules.radio]" class="custom-radio">
              <v-radio label="มีคูปอง" value="one" class="text-radiio"></v-radio>
              <v-radio label="ไม่มีคูปอง" value="two" class="text-radiio"></v-radio>
            </v-radio-group>
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
        <!-- dialog ยืนยันการส่งข้อมูล-->
        <v-dialog v-model="dialog" max-width="400px">
          <v-card class="dialog">
            <v-card-title class="text-center" style="font-weight: bold; font-size: 22px">
              🎉 ส่งข้อมูลสำเร็จ!
            </v-card-title>
            <v-card-text class="text-center" style="font-size: 18px">
              ข้อมูลของคุณถูกส่งเรียบร้อยแล้ว
            </v-card-text>
            <v-card-actions justify-center>
              <v-btn class="btn-dialog" @click="confirmReset(bookForm)"> ตกลง </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeStudent from '@/components/student/HomeStudent.vue'
import { useRoute } from 'vue-router'
import RoleLayout from '@/components/RoleLayout.vue'
import BookForm from '@/components/BookForm.vue'
<<<<<<< HEAD
import axios from 'axios';
=======
>>>>>>> master

const bookForm = ref(null)
const formValid = ref(false)
const submitted = ref(false)
const valid = ref(false) //ใช้กับ v-form
const dialog = ref(false)
const inline = ref(null)

const route = useRoute()
// Get role from meta
const role = route.meta.role || 'default'

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

const rules = {
  required: (value: string) => {
    return !value ? 'ต้องกรอกข้อมูล' : true
  },
  email: (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'รูปแบบอีเมลไม่ถูกต้อง',
  phone: (value: string) => /^[0-9]{10}$/.test(value) || 'หมายเลขโทรศัพท์ต้องมี 10 หลัก',
  isbn: (value: string) => /^(97(8|9))?\d{9}(\d|X)$/.test(value) || 'รูปแบบ ISBN ไม่ถูกต้อง',
  number: (value: string) => /^[1-9]+$/.test(value) || 'ต้องเป็นตัวเลขเท่านั้น',
  radio: (value) => !!value || 'กรุณาเลือกหนึ่งตัวเลือก',
}

const submitForm = async (bookForm: any) => {
  if (bookForm) {
    const { valid: isValid } = await bookForm.validate() // ตรวจสอบ validate

    if (isValid) {
<<<<<<< HEAD
      // try {
      //   // ส่งข้อมูลไปยัง API
      //   await axios.post('http://http://localhost:3000/', book.value);
=======
>>>>>>> master
      submitted.value = true // ตั้งค่าสำเร็จ
      dialog.value = true // แสดง Dialog
      // ไม่รีเซ็ตฟอร์มที่นี่
    } else {
      submitted.value = false
      console.log('Validation Failed')
    }
  }
}

const confirmReset = (bookForm: any) => {
  dialog.value = false // ปิด Dialog
  resetForm(bookForm) // รีเซ็ตค่าฟอร์มหลังจากกด "ตกลง"
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

  bookForm.reset() // รีเซ็ต v-form
  submitted.value = false
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

.dialog {
  background-color: #eed3d9;
}

.btn-dialog {
  font-size: 16px;
  font-weight: bold; /* ตัวหนา */
  border-radius: 25px; /* ขอบมน */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* เงา */
  background-color: #e0e6f0; /* สีพื้นหลังปุ่ม */
  color: black; /* สีตัวอักษร */
}

.v-radio-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.v-radio {
  margin-right: 16px;
  font-size: 24px; /* เพิ่มขนาดฟอนต์ให้ใหญ่ขึ้น */
  color: black;
}

.custom-radio {
  font-size: 24px; /* เพิ่มขนาดฟอนต์ให้ใหญ่ขึ้น */
  color: black;
}

.text-radiio {
  font-weight: bold;
  font-size: 24px; /* เพิ่มขนาดฟอนต์ให้ใหญ่ขึ้น */
  color: black;
}
</style>
