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
            <label for="name" style="font-size: 17px"
              >คำนำหน้า <span class="required-asterisk">*</span></label
            >
            <v-text-field
              v-model="book.Prefix"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top text"
              dense
            ></v-text-field>
          </div>

          <!-- ชื่อ -->
          <div class="form-row">
            <label for="firstName" style="font-size: 17px"
              >ชื่อ<span class="required-asterisk">*</span></label
            >
            <v-text-field
              v-model="book.FirstName"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- นามสกุล -->
          <div class="form-row">
            <label for="lastName" style="font-size: 17px"
              >นามสกุล<span class="required-asterisk">*</span></label
            >
            <v-text-field
              v-model="book.LastName"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ตำแหน่ง -->
          <div class="form-row">
            <label for="role" style="font-size: 17px"
              >ตำแหน่ง<span class="required-asterisk">*</span></label
            >
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
            <label for="faculty" style="font-size: 17px"
              >คณะ<span class="required-asterisk">*</span></label
            >
            <v-select
              v-model="book.Faculty"
              :items="faculties"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-select>
          </div>

          <!-- สาขา -->
          <div class="form-row">
            <label for="department" style="font-size: 17px"
              >สาขา<span class="required-asterisk">*</span></label
            >
            <v-select
              v-model="book.Department"
              :items="departments"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-select>
          </div>

          <!-- เบอร์ -->
          <div class="form-row">
            <label for="tel" style="font-size: 17px"
              >เบอร์<span class="required-asterisk">*</span></label
            >
            <v-text-field
              v-model="book.Tel"
              :rules="[rules.required, rules.tel]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- E-mail -->
          <div class="form-row">
            <label for="email" style="font-size: 17px"
              >E-mail<span class="required-asterisk">*</span></label
            >
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
            <label for="store" style="font-size: 17px"
              >ชื่อร้านค้า<span class="required-asterisk">*</span></label
            >
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
            <label for="title" style="font-size: 17px"
              >ชื่อหนังสือ<span class="required-asterisk">*</span></label
            >
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
            <label for="author" style="font-size: 17px">ผู้ชื่อแต่ง</label>
            <v-text-field
              v-model="book.Author"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ปีพิมพ์ -->
          <div class="form-row">
            <label for="year" style="font-size: 17px">ปีพิมพ์</label>
            <v-text-field
              v-model="book.Year"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- ISBN -->
          <div class="form-row">
            <label for="isbn" style="font-size: 17px"
              >ISBN<span class="required-asterisk">*</span></label
            >
            <v-text-field
              v-model="book.isbn"
              :rules="[rules.required, rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- รายวิชา -->
          <div class="form-row">
            <label for="subject" style="font-size: 17px"
              >รายวิชา<span class="required-asterisk">*</span></label
            >
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
            <label for="price" style="font-size: 17px"
              >ราคาสุทธิ<span class="required-asterisk">*</span></label
            >
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
            <label for="count" style="font-size: 17px"
              >จำนวนเล่ม<span class="required-asterisk">*</span></label
            >
            <v-text-field
              v-model="book.Count"
              :rules="[rules.required, rules.number]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-text-field>
          </div>

          <!-- คูปอง -->
          <div class="form-row">
            <label for="coupon" style="font-size: 17px"
              >คูปอง<span class="required-asterisk">*</span></label
            >
            <v-select
              v-model="book.Coupon"
              :items="couponUsed"
              :rules="[rules.required]"
              variant="outlined"
              class="text-feild-top"
              dense
            ></v-select>
          </div>

          <!-- ปุ่มยืนยัน -->
          <v-btn
            :disabled="!valid"
            elevation="8"
            class="mt-4 confirm-btn confirm-btnheight"
            style="background-color: #eed3d9"
            @click="submitForm"
          >
            ยืนยัน
          </v-btn>
        </v-form>
        <!-- dialog ยืนยันการส่งข้อมูล-->
        <v-dialog v-model="dialog" max-width="400px">
          <v-card class="dialog" style="background-color: #ede8dc">
            <v-card-title
              class="text-start"
              style="
                font-weight: bold;
                background-color: #eed3d9;
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
            <v-card-text class="text-start" style="font-size: 16px">
              คุณต้องการส่งแบบฟอร์มหรือไม่?
            </v-card-text>
            <v-card-actions justify="start">
              <v-btn
                color="black"
                text
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
import { onMounted, ref } from 'vue'
import { jwtDecode } from 'jwt-decode'
import type { VForm } from 'vuetify/components'

// import type Coupon from './Coupon.vue'

const bookForm = ref<VForm | null>(null)
const submitted = ref(false)
const valid = ref(false) //ใช้กับ v-form
const dialog = ref(false)
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
  Price: '',
  Count: '',
  Coupon: '',
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
    return !value ? 'ต้องกรอกข้อมูล' : true
  },
  email: (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'รูปแบบอีเมลไม่ถูกต้อง',
  tel: (value: string) => /^[0-9]{9,10}$/.test(value) || 'หมายเลขโทรศัพท์ต้องมี 9 - 10 หลัก',
  isbn: (value: string) => /^(97(8|9))?\d{9}(\d|X)$/.test(value) || 'รูปแบบ ISBN ไม่ถูกต้อง',
  number: (value: string) => /^[0-9]+(\.[0-9]+)?$/.test(value) || 'ต้องเป็นตัวเลขเท่านั้น',
  radio: (value) => !!value || 'กรุณาเลือกหนึ่งตัวเลือก',
}

// const submitForm = async () => {
//   const form = bookForm.value // เข้าถึง bookForm จาก ref
//   if (form && typeof form.validate === 'function') {
//     const { valid } = await form.validate() // เรียก validate()

//     if (valid) {
//       try {
//         const formData = {
//           user_fullname: book.value.Prefix + ' ' + book.value.FirstName + ' ' + book.value.LastName,
//           user_name: book.value.FirstName,
//           role_id: Number(book.value.Role),
//           user_email: book.value.Email,
//           user_tel: book.value.Tel,
//           faculty_id: Number(book.value.Faculty),
//           department_id: book.value.Department,
//           store_id: stores.value.indexOf(book.value.Store) + 1,
//           book_title: book.value.Title,
//           book_author: book.value.Author,
//           book_subject: book.value.Subject,
//           published_year: Number(book.value.Year),
//           ISBN: book.value.isbn,
//           book_price: Number(book.value.Price),
//           book_quantity: Number(book.value.Count),
//           user_id: book.value.User ? Number(book.value.User) : null,
//           coupon_used: book.value.Coupon,
//         }

//         const response = await axios.post('http://localhost:3000/offer-form', formData, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         })

//         console.log('Response:', response.data)
//         submitted.value = true
//         dialog.value = true
//       } catch (error) {
//         console.error('Error submitting form:', error)
//         if (error.response && error.response.data) {
//           console.log('User ID:', book.value.User)
//           console.error('API Error:', error.response.data.message)
//         }
//       }
//     } else {
//       console.log('Validation Failed')
//     }
//   } else {
//     console.error('Form reference is invalid or validate is not a function')
//   }
// }

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

// Helper function
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
  dialog.value = false; // ปิด dialog
  resetForm(bookForm.value); // ล้างค่าฟอร์ม
};

const confirmForm = async (bookForm: any) => {
  try {
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
      published_year: Number(book.value.Year),
      ISBN: book.value.isbn,
      book_price: Number(book.value.Price),
      book_quantity: Number(book.value.Count),
      user_id: book.value.User ? Number(book.value.User) : null, // ตรวจสอบ user_id
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
  book.value = {
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
    Price: '',
    Count: '',
  }

  bookForm.reset() // รีเซ็ต v-form
  submitted.value = false
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

// const fetchRoles = async () => {
//   try {
//     const response = await axios.get('http://localhost:3000/role')
//     console.log('Response data:', response.data)

//     const groupedRoles = {
//       อาจารย์: response.data.filter((role: any) =>
//         ['Teacher', 'StaffFaculty'].includes(role.role_name),
//       ),
//       นิสิต: response.data.filter((role: any) => role.role_name === 'Student'),
//       บุคลากร: response.data.filter((role: any) =>
//         ['StaffLibrary', 'Executive'].includes(role.role_name),
//       ),
//     }

//     console.log('Grouped Roles:', groupedRoles)
//     roles.value = Object.keys(groupedRoles) // ตั้งค่าข้อมูลสำหรับ `v-select`
//   } catch (error) {
//     console.error('Error fetching roles:', error)
//   }
// }

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

// const fetchUserData = async () => {
//   const token = localStorage.getItem('token')

//   if (!token) {
//     alert('ไม่พบ Token กรุณาเข้าสู่ระบบใหม่')
//     window.location.href = '/'
//     return
//   }

//   try {
//     let userId = null
//     if (isTokenExpired(token)) {
//       // ถ้า Token หมดอายุ ให้รีเฟรชด้วย Refresh Token
//       const newAccessToken = await refreshToken()
//       if (newAccessToken) {
//         const decoded: any = jwtDecode(newAccessToken)
//         userId = decoded.sub // ดึง user_id จาก sub ใน token
//         user.value.Prefix = decoded.prefix
//         user.value.FirstName = decoded.firstName
//         user.value.LastName = decoded.lastName
//         user.value.Role = decoded.offer_position
//         user.value.Faculty = decoded.faculty
//         user.value.Department = decoded.department
//         user.value.Tel = decoded.tel
//         user.value.Email = decoded.email
//         user.value.User = userId // เก็บ user_id ที่ดึงมา
//       }
//     } else {
//       const decoded: any = jwtDecode(token)
//       userId = decoded.sub // ดึง user_id จาก sub ใน token
//       user.value.Prefix = decoded.prefix
//       user.value.FirstName = decoded.firstName
//       user.value.LastName = decoded.lastName
//       user.value.Role = decoded.offer_position
//       user.value.Faculty = decoded.faculty
//       user.value.Department = decoded.department
//       user.value.Tel = decoded.tel
//       user.value.Email = decoded.email
//       user.value.User = userId // เก็บ user_id ที่ดึงมา
//     }

//     // ทำการตั้งค่าอื่น ๆ ให้กับ book
//     book.value.Prefix = user.value.Prefix
//     book.value.FirstName = user.value.FirstName
//     book.value.LastName = user.value.LastName
//     book.value.Role = user.value.Role
//     book.value.Faculty = user.value.Faculty
//     book.value.Department = user.value.Department
//     book.value.Tel = user.value.Tel
//     book.value.Email = user.value.Email
//     user.value.User = user.value.User
//   } catch (error) {
//     console.error('Token decoding error:', error)
//   }
// }

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
</style>
