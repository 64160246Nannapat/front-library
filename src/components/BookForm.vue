<template>
  <v-main style="height: 500px; margin-top: -90px">
    <!-- <HomeStudent /> -->
    <v-main>
      <v-container>
        <div class="header" style="margin-bottom: 20px">
          <img class="header-image" src="@/assets/library (1).png" alt="Library Image" />
          <h1>แบบฟอร์มการเสนอหนังสือ</h1>
        </div>
        <v-form ref="bookForm" v-model="valid" class="form-wrapper">
          <!-- ใช้ Grid Layout สำหรับการจัดฟอร์ม -->
          <div class="form-grid">
            <v-row class="form-row" align="center" justify="center" no-gutters>
              <v-col cols="12" md="6" class="mb-1">
                <!-- ชื่อ-นามสกุล -->
                <label for="name" style="font-size: 17px; margin-bottom: 4px">
                  ชื่อ-นามสกุล<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  :model-value="fullName"
                  :rules="[rules.required]"
                  variant="plain"
                  class="text-feild-top text gray-field"
                  dense
                  :readonly="isReadOnly"
                  style="margin-top: 0"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" class="mb-1">
                <!-- ตำแหน่ง -->
                <label for="role" style="font-size: 17px; margin-bottom: 4px">
                  ตำแหน่ง<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Role"
                  :rules="[rules.required]"
                  variant="plain"
                  class="text-feild-top text gray-field"
                  dense
                  :readonly="isReadOnly"
                  style="margin-top: 0"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="form-row" align="center" justify="center" no-gutters>
              <v-col cols="12" md="6" class="mb-1">
                <!-- คณะ -->
                <label for="faculty" style="font-size: 17px; margin-bottom: 4px">
                  คณะ<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Faculty"
                  :items="faculties"
                  :rules="[rules.required]"
                  variant="plain"
                  class="text-feild-top text gray-field"
                  dense
                  :readonly="isReadOnly"
                  style="margin-top: 0"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" class="mb-1">
                <!-- สาขา -->
                <label for="department" style="font-size: 17px; margin-bottom: 4px">
                  สาขา<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Department"
                  :items="departments"
                  :rules="[rules.required]"
                  variant="plain"
                  class="text-feild-top text gray-field"
                  dense
                  :readonly="isReadOnly"
                  style="margin-top: 0"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="form-row" align="center" justify="center" no-gutters>
              <v-col cols="12" md="6" class="mb-1">
                <!-- เบอร์ -->
                <label for="tel" style="font-size: 17px; margin-bottom: 4px">
                  เบอร์<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Tel"
                  :rules="[rules.required, rules.tel]"
                  variant="plain"
                  class="text-feild-top text gray-field"
                  dense
                  :readonly="isReadOnly"
                  style="margin-top: 0"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" class="mb-1">
                <!-- E-mail -->
                <label for="email" style="font-size: 17px; margin-bottom: 4px">
                  E-mail<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Email"
                  :rules="[rules.required, rules.email]"
                  variant="plain"
                  class="text-feild-top text gray-field"
                  dense
                  :readonly="isReadOnly"
                  style="margin-top: 0"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="form-row align-center pa-0">
              <v-col cols="12" md="6" class="mb-1">
                <!-- ชื่อร้านค้า -->
                <label for="store" style="font-size: 17px">
                  ชื่อร้านค้า<span class="required-asterisk">*</span>
                </label>
                <v-select
                  v-model="book.Store"
                  :items="stores"
                  :rules="[rules.required]"
                  variant="outlined"
                  class="custom-input"
                  dense
                ></v-select>
              </v-col>

              <v-col cols="12" md="6" class="mb-1">
                <!-- ชื่อหนังสือ -->
                <label for="title" style="font-size: 17px">
                  ชื่อหนังสือ<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Title"
                  :rules="[rules.required]"
                  variant="outlined"
                  class="custom-input"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="form-row pa-0 mt-n3">
              <!-- ลดระยะห่างแถวนี้ -->
              <!-- ผู้แต่ง -->
              <v-col cols="12" md="6" class="mb-1">
                <label for="author" style="font-size: 17px">ผู้ชื่อแต่ง</label>
                <v-text-field
                  v-model="book.Author"
                  variant="outlined"
                  class="text-feild-top"
                  dense
                ></v-text-field>
              </v-col>

              <!-- ปีพิมพ์ -->
              <v-col cols="12" md="6" class="mb-1">
                <label for="year" style="font-size: 17px">ปีพิมพ์</label>
                <v-text-field
                  v-model="book.Year"
                  variant="outlined"
                  class="text-feild-top"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="form-row pa-0 mt-n3">
              <!-- ลดระยะห่าง -->
              <v-col cols="12" md="6" class="mb-1">
                <!-- ISBN -->
                <label for="isbn" style="font-size: 17px">
                  ISBN<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.isbn"
                  :rules="[rules.required, rules.required]"
                  variant="outlined"
                  class="text-feild-top"
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" class="mb-1">
                <!-- รายวิชา -->
                <label for="subject" style="font-size: 17px">
                  รายวิชา<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Subject"
                  :rules="[rules.required]"
                  variant="outlined"
                  class="text-feild-top"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="form-row pa-0 mt-n3">
              <!-- ลดระยะห่าง -->
              <v-col cols="12" md="6" class="mb-1">
                <!-- ราคาสุทธิ -->
                <label for="price" style="font-size: 17px">
                  ราคาสุทธิ<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Price"
                  :rules="[rules.required, rules.number]"
                  variant="outlined"
                  class="text-feild-top"
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" class="mb-1">
                <!-- จำนวนเล่ม -->
                <label for="count" style="font-size: 17px">
                  จำนวนเล่ม<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Count"
                  :rules="[rules.required, rules.number]"
                  variant="outlined"
                  class="text-feild-top"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- ปุ่มยืนยัน -->
            <v-btn
              :disabled="!valid"
              elevation="8"
              class="mt-4 confirm-btn confirm-btnheight"
              style="background-color: #C39898"
              @click="submitForm"
            >
              ยืนยัน
            </v-btn>
          </div>
        </v-form>
        <!-- dialog ยืนยันการส่งข้อมูล-->
        <v-dialog v-model="dialog" max-width="400px">
          <v-card class="dialog" style="background-color: #ede8dc">
            <v-card-title
              class="text-start"
              style="
                font-weight: bold;
                background-color: #C39898;
                padding: 16px;
                border-top-left-radius: 0px; /* ไม่มีความมนที่มุมบนซ้าย */
                border-top-right-radius: 0px; /* ไม่มีความมนที่มุมบนขวา */
                border-bottom-left-radius: 16px; /* ความมนที่มุมล่างซ้าย */
                border-bottom-right-radius: 16px;
                font-size: 20px;
              "
            >
              ยืนยันการส่งแบบฟอร์ม
            </v-card-title>
            <v-card-text class="text-start" style="font-size: 14px; color: #808080">
              <div>ชื่อ: {{ book.FirstName }} {{ book.LastName }}</div>
              <div>ตำแหน่ง: {{ book.Role }}</div>
              <div>คณะ: {{ book.Faculty }}</div>
              <div>ร้าน: {{ book.Store }}</div>
              <div>ชื่อหนังสือ: {{ book.Title }}</div>
              <div>ราคา/จำนวน: {{ book.Price }} บาท, {{ book.Count }} เล่ม</div>
            </v-card-text>

            <v-card-actions justify="start">
              <v-btn
                color="black"
                @click="cancelForm"
                style="
                  font-weight: bold;
                  border: 2px;
                  border-radius: 8px;
                  background-color: #fa8072;
                  margin-bottom: 8px;
                "
              >
                ยกเลิก
              </v-btn>

              <v-btn
                color="black"
                style="
                  font-weight: bold;
                  border: 2px;
                  border-radius: 8px;
                  background-color: #58d68d;
                  margin-bottom: 8px;
                "
                @click="confirmForm(bookForm)"
              >
                ยืนยัน
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import type { VForm } from 'vuetify/components'
import $ from 'jquery'

const isReadonly = ref(false)
const bookForm = ref<VForm | null>(null)
const submitted = ref(false)
const valid = ref(false) //ใช้กับ v-form
const dialog = ref(false)
const isReadOnly = ref(true)
const disableValidation = ref(false)
const fullName = computed(() => {
  return `${book.value.Prefix} ${book.value.FirstName} ${book.value.LastName}`
})

const book = ref({
  Prefix: '',
  FirstName: '',
  LastName: '',
  Role: '',
  Faculty: '',
  Department: '',
  Tel: '',
  Email: '',
  Store: '',
  Title: '',
  Author: '',
  Year: '',
  isbn: '',
  Subject: '',
  Price: null,
  Count: null,
  Coupon: 'ไม่มีคูปอง',
  User: '',
})

const user = ref({
  Prefix: '',
  FirstName: '',
  LastName: '',
  Role: '',
  Faculty: '',
  Department: '',
  Tel: '',
  Email: '',
  User: '',
})

const rules = {
  required: (value: string) => {
    if (disableValidation.value) return true // ปิด validation
    return value ? true : 'ต้องกรอกข้อมูล'
  },
  email: (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'รูปแบบอีเมลไม่ถูกต้อง',
  tel: (value: string) => /^[0-9]{9,10}$/.test(value) || 'หมายเลขโทรศัพท์ต้องมี 9 - 10 หลัก',
  isbn: (value: string) => /^(97(8|9))?\d{9}(\d|X)$/.test(value) || 'รูปแบบ ISBN ไม่ถูกต้อง',
  number: (value: string | null) => {
    if (value === null || value === undefined || value === '') {
      return true // อนุญาตให้ช่องว่างไม่ต้อง alert
    }
    return /^[0-9]+(\.[0-9]+)?$/.test(value) || 'ต้องเป็นตัวเลขเท่านั้น'
  },
  radio: (value) => !!value || 'กรุณาเลือกหนึ่งตัวเลือก',
}

const fetchUserData = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    alert('ไม่พบ Token กรุณาเข้าสู่ระบบใหม่')
    window.location.href = '/'
    return
  }

  try {
    let userId = null
    const decoded: any = isTokenExpired(token) ? await refreshAndDecodeToken() : jwtDecode(token)

    if (decoded) {
      userId = decoded.sub // ดึง user_id จาก sub ใน token
      user.value.Prefix = decoded.prefix
      user.value.FirstName = decoded.firstName
      user.value.LastName = decoded.lastName
      user.value.Role = decoded.offer_position
      user.value.Faculty = decoded.faculty
      user.value.Department = decoded.department
      user.value.Tel = decoded.tel
      user.value.Email = decoded.email
      user.value.User = userId // เก็บ user_id ที่ดึงมา
    }

    // ตั้งค่าอื่น ๆ ให้กับ book
    book.value.Prefix = user.value.Prefix
    book.value.FirstName = user.value.FirstName
    book.value.LastName = user.value.LastName
    book.value.Role = user.value.Role
    book.value.Faculty = user.value.Faculty
    book.value.Department = user.value.Department
    book.value.Tel = user.value.Tel
    book.value.Email = user.value.Email
    book.value.User = user.value.User

    isReadonly.value = true
  } catch (error) {
    console.error('Token decoding error:', error)
  }
}

const submitForm = async () => {
  const form = bookForm.value // เข้าถึง bookForm จาก ref
  if (form && typeof form.validate === 'function') {
    const { valid } = await form.validate() // เรียก validate()

    if (valid) {
      // หาก valid ให้แสดง dialog เพื่อยืนยันการส่งแบบฟอร์ม
      dialog.value = true
    } else {
      console.log('Validation Failed')
    }
  } else {
    console.error('Form reference is invalid or validate is not a function')
  }
}

const refreshAndDecodeToken = async () => {
  try {
    const newAccessToken = await refreshToken()
    return jwtDecode(newAccessToken)
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

const cancelForm = () => {
  dialog.value = false // ปิด dialog
  resetForm(bookForm) // ล้างค่าฟอร์ม
}

const confirmForm = async (bookForm: any) => {
  try {
    const userId = book.value.User ? Number(book.value.User) : null // ตรวจสอบ user_id
    const formData = {
      user_fullname: `${book.value.Prefix} ${book.value.FirstName} ${book.value.LastName}`,
      user_name: book.value.FirstName,
      role_id: Number(book.value.Role),
      user_email: book.value.Email,
      user_tel: book.value.Tel,
      faculty_id: Number(book.value.Faculty),
      department_id: book.value.Department,
      store_id: stores.value.indexOf(book.value.Store) + 1,
      book_title: book.value.Title,
      book_author: book.value.Author,
      book_subject: book.value.Subject,
      book_category: 'เสนอหนังสือออนไลน์',
      published_year: Number(book.value.Year),
      ISBN: book.value.isbn,
      book_price: Number(book.value.Price),
      book_quantity: Number(book.value.Count),
      user_id: userId, // ใช้ userId ที่ถูกตรวจสอบแล้ว
      coupon_used: book.value.Coupon,
    }

    const response = await axios.post('http://localhost:3000/offer-form', formData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    console.log('Response:', response.data)
    submitted.value = true
    dialog.value = false // ปิด dialog
    resetForm(bookForm) // ล้างค่าฟอร์ม
  } catch (error) {
    console.error('Error submitting form:', error)
    if (error.response && error.response.data) {
      console.log('User ID:', book.value.User)
      console.error('API Error:', error.response.data.message)
    }
  }
}

const resetForm = (bookForm: any) => {
  // เก็บค่าที่ต้องการคงเดิม
  const { Prefix, FirstName, LastName, Role, Faculty, Department, Tel, Email } = book.value

  // ปิด validation ชั่วคราว
  disableValidation.value = true

  // รีเซ็ตเฉพาะฟิลด์ที่ต้องการ
  book.value = {
    Prefix,
    FirstName,
    LastName,
    Role,
    Faculty,
    Department,
    Tel,
    Email,
    Store: '',
    Title: '',
    Author: '',
    Year: '',
    isbn: '',
    Subject: '',
    Price: null,
    Count: null,
  }

  // เปิด validation อีกครั้ง
  setTimeout(() => {
    disableValidation.value = false
  }, 0)

  // รีเซ็ต validation (ลบข้อความ alert validation)
  bookForm.resetValidation()

  submitted.value = false // รีเซ็ตสถานะการส่งฟอร์ม
}

const fetchStores = async () => {
  try {
    const response = await axios.get('http://localhost:3000/store')
    console.log('Response data:', response.data) // ตรวจสอบข้อมูลที่ส่งกลับมา
    stores.value = response.data.map((store: any) => store.store_name) // ปรับตามโครงสร้างข้อมูล
  } catch (error) {
    console.error('Error fetching stores:', error)
  }
}

const fetchFaculties = async () => {
  try {
    const response = await axios.get('http://localhost:3000/faculty')
    console.log('Response data:', response.data) // ตรวจสอบข้อมูลที่ส่งกลับมา
    faculties.value = response.data.map((faculty: any) => faculty.faculty_name)
  } catch (error) {
    console.error('Error fetching faculties:', error)
  }
}

const fetchDepartments = async () => {
  try {
    const response = await axios.get('http://localhost:3000/department')
    console.log('Response data:', response.data) // ตรวจสอบข้อมูลที่ส่งกลับมา
    departments.value = response.data.map((department: any) => department.department_name)
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

const isTokenExpired = (token: string) => {
  const decoded: any = jwtDecode(token)
  const currentTime = Date.now() / 1000 // Convert to seconds
  return decoded.exp < currentTime // Compare expiration time
}

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (refreshToken) {
    try {
      const response = await axios.post('http://localhost:3000/auth/refresh', { refreshToken })
      const { access_token, refresh_token } = response.data
      // เก็บ Access Token และ Refresh Token ใหม่
      localStorage.setItem('token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      return access_token // คืนค่าใหม่ของ access_token
    } catch (error) {
      console.error('ไม่สามารถรีเฟรช token ได้:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/'
    }
  } else {
    alert('ไม่พบ Refresh Token')
    window.location.href = '/'
  }
}

onMounted(async () => {
  await fetchUserData()
  console.log('Component mounted')
  await Promise.all([
    fetchStores(),
    // fetchRoles(),
    fetchFaculties(),
    fetchDepartments(),
  ])
})

const stores = ref<string[]>([])
const roles = ['อาจารย์', 'นิสิต', 'บุคลากร', 'นักวิจัย']
const couponUsed = ['มีคูปอง', 'ไม่มีคูปอง']
const faculties = ref<string[]>([])
const departments = ref<string[]>([])
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
  margin-bottom: 10px;
  font-size: 20px;
  justify-content: space-between;
}

.form-row label {
  min-width: 120px; /* กำหนดความกว้างขั้นต่ำให้ข้อความ */
  margin-bottom: 10px;
  margin-right: 10px;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  font-size: 20px;
}

.text-feild-top {
  margin-top: 2px;
  min-height: 50px;
  width: 100%;
  max-width: 500px;
}

.v-text-field,
.v-select {
  width: 100%; /* เพิ่มความกว้างเต็มที่ */
  max-width: 1000px;
  flex-grow: 1; /* ให้ช่องกรอกข้อมูลขยายตามพื้นที่ที่เหลือ */
}

.confirm-btn {
  color: black;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
  margin-left: auto;
  transition: background-color 0.3s ease; /* เพิ่ม transition เพื่อเปลี่ยนสีที่เรียบง่าย */
}

.confirm-btnheight {
  width: 100px;
  height: 50px;
}

.dialog {
  width: 500px;
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

.required-asterisk {
  color: red;
  font-size: 16px;
  margin-left: 2px;
}

.text {
  font-size: 18px;
}

.gray-field {
  color: #666666; /* สีตัวอักษรเทา */
  pointer-events: none; /* ปิดการโต้ตอบ */
}

.form-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr; /* แสดง 1 คอลัมน์ต่อแถว */
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.confirm-btn {
  background-color: #eed3d9;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.confirm-btn:hover {
  background-color: #e5a1a8;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
