<template>
  <v-main style="height: 500px; margin-top: -90px">
    <v-main>
      <v-container>
        <div class="header" style="margin-bottom: 20px">
          <img class="header-image" src="@/assets/library (1).png" alt="Library Image" />
          <h1>แบบฟอร์มการเสนอหนังสือ</h1>
        </div>
        <v-form ref="bookForm" v-model="valid" class="form-wrapper">
          <!-- ใช้ Grid Layout สำหรับการจัดฟอร์ม -->
          <div class="form-grid">
            <!--ข้อมูลผู้เสนอ-->
            <v-row class="form-row pa-0 mt-n3">
              <v-col cols="12" md="6" class="mb-1">
                <!-- ชื่อ-นามสกุล -->
                <label for="name" style="font-size: 17px; margin-bottom: 4px">
                  ชื่อ-นามสกุล<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="fullName"
                  :rules="[rules.required]"
                  variant="outlined"
                  class="text-feild-top text gray-field"
                  dense
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
                  variant="outlined"
                  class="text-feild-top text gray-field"
                  dense
                  style="margin-top: 0"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="form-row pa-0 mt-n3">
              <v-col cols="12" md="6" class="mb-1">
                <!-- คณะ -->
                <label for="faculty" style="font-size: 17px; margin-bottom: 4px">
                  คณะ<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Faculty"
                  :items="faculties"
                  :rules="[rules.required]"
                  variant="outlined"
                  class="text-feild-top text gray-field"
                  dense
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
                  variant="outlined"
                  class="text-feild-top text gray-field"
                  dense
                  style="margin-top: 0"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="form-row pa-0 mt-n3">
              <v-col cols="12" md="6" class="mb-1">
                <!-- เบอร์ -->
                <label for="tel" style="font-size: 17px; margin-bottom: 4px">
                  เบอร์<span class="required-asterisk">*</span>
                </label>
                <v-text-field
                  v-model="book.Tel"
                  :rules="[rules.required, rules.tel]"
                  variant="outlined"
                  class="text-feild-top text gray-field"
                  dense
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
                  variant="outlined"
                  class="text-feild-top text gray-field"
                  dense
                  style="margin-top: 0"
                ></v-text-field>
              </v-col>
            </v-row>

            <!--ข้อมูลหนังสือ-->
            <v-row class="form-row align-center pa-0">
              <v-col cols="12" md="12" class="mb-1">
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
              <v-col cols="12" md="12" class="mb-1">
                <label for="author" style="font-size: 17px">ชื่อผู้แต่ง</label>
                <v-text-field
                  v-model="book.Author"
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
                  :rules="[rules.required]"
                  variant="outlined"
                  class="text-feild-top"
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" class="mb-1">
                <!-- รายวิชา -->
                <label for="Course" style="font-size: 17px"> รายวิชา </label>
                <v-text-field
                  v-model="book.Course"
                  variant="outlined"
                  class="text-feild-top"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="form-row pa-0 mt-n3">
              <!-- ลดระยะห่างแถวนี้ -->
              <!-- detail -->
              <v-col cols="12" md="12" class="mb-1">
                <label for="detail" style="font-size: 17px">รายละเอียด</label>
                <v-textarea
                  v-model="book.Details"
                  variant="outlined"
                  class="text-feild-top"
                  dense
                  :style="{ width: '100%', minHeight: '100px' }"
                  rows="4"
                ></v-textarea>

                <v-card-text style="font-size: 14px; color: gray; margin-top: -5px; padding-top: 0">
                  (ex. ผู้แปล ณัฐกฤตา เพ็ญกุล, สำนักพิมพ์ กรุงเทพฯ : วีเลิร์น, ปีพิมพ์ 2566,
                  พิมพ์ครั้งที่ 1, 137 หน้า : ภาพประกอบ ; 21 ซม)
                </v-card-text>
              </v-col>
            </v-row>

            <!-- ปุ่มยืนยัน -->
            <v-btn
              :disabled="!valid"
              elevation="8"
              class="mt-4 confirm-btn confirm-btnheight"
              style="background-color: #c39898"
              @click="submitForm"
            >
              ยืนยัน
            </v-btn>
          </div>
        </v-form>
        <!-- dialog ยืนยันการส่งข้อมูล-->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card class="dialog" style="background-color: #ede8dc">
            <v-card-title
              class="text-start"
              style="
                font-weight: bold;
                background-color: #c39898;
                padding: 16px;
                border-top-left-radius: 0px;
                border-top-right-radius: 0px;
                border-bottom-left-radius: 16px;
                border-bottom-right-radius: 16px;
                font-size: 20px;
              "
            >
              {{ isDuplicate ? 'แจ้งเตือน' : 'ยืนยันการส่งแบบฟอร์ม' }}
            </v-card-title>

            <v-card-text class="text-start" style="font-size: 14px; color: #808080">
              <!-- แสดงรายละเอียดหนังสือ -->
              <div>
                <div>ชื่อ: {{ book.FirstName }} {{ book.LastName }}</div>
                <div>ตำแหน่ง: {{ book.Role }}</div>
                <div>คณะ: {{ book.Faculty }}</div>
                <div>ชื่อหนังสือ: {{ book.Title }}</div>
                <div>ชื่อผู้แต่ง: {{ book.Author }}</div>
                <div>ISBN: {{ book.isbn }}</div>
                <div>รายวิชา: {{ book.Course || 'ไม่ระบุ' }}</div>
                <div>จำนวน: {{ book.Count }} เล่ม</div>
                <div>รายละเอียด: {{ book.Details || 'ไม่มีรายละเอียด' }}</div>
              </div>
              <v-divider v-if="isDuplicate" class="my-4" style="color: black"></v-divider>
              <!-- แสดงข้อความแจ้งเตือนหากพบ ISBN ซ้ำ -->
              <div v-if="isDuplicate" style="color: red; font-weight: bold; margin-top: 16px">
                {{ confirmMessage }}
              </div>
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

              <!-- ปุ่มยืนยันที่จะส่งฟอร์ม -->
              <v-btn
                color="black"
                @click="confirmForm"
                style="
                  font-weight: bold;
                  border: 2px;
                  border-radius: 8px;
                  background-color: #58d68d;
                  margin-bottom: 8px;
                "
              >
                ยืนยัน
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- dialog ยืนยันการส่งข้อมูลสำเร็จ-->
        <v-dialog
          v-model="successdialog"
          max-width="300px"
          persistent
          center
          @click:outside="successdialog = false"
        >
          <v-card class="dialog" style="background-color: #ede8dc; border-radius: 50px">
            <v-card-text
              class="text-center"
              style="font-size: 24px; font-weight: bold; color: #808080; padding: 20px"
            >
              <img
                src="@/assets/check.png"
                alt="Check"
                style="width: 80px; height: 80px; margin-bottom: 20px"
              />

              <!-- แสดงข้อความยืนยัน -->
              <div>เสนอข้อมูลหนังสือสำเร็จ</div>
            </v-card-text>
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

const bookForm = ref<VForm | null>(null)
const submitted = ref(false)
const valid = ref(false) //ใช้กับ v-form
const dialog = ref(false)
const successdialog = ref(false)
const isDuplicate = ref(false)
const disableValidation = ref(false)
const confirmMessage = ref('')

const fullName = computed(() => {
  return `${book.value.Prefix || ''} ${book.value.FirstName || ''} ${book.value.LastName || ''}`.trim()
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
  Title: '',
  Author: '',
  Year: '',
  isbn: '',
  Course: '',
  User: '',
  Details: '',
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
    alert('❌ ไม่พบ Token กรุณาเข้าสู่ระบบใหม่')
    window.location.href = '/'
    return
  }

  try {
    let userId = null
    const decoded: any = isTokenExpired(token) ? await refreshAndDecodeToken() : jwtDecode(token)

    if (!decoded || !decoded.sub) {
      console.error('❌ Token decoding failed or userId not found!')
      alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาเข้าสู่ระบบใหม่')
      return
    }

    userId = decoded.sub

    let userData = {}
    switch (decoded.role) {
      case 'Student':
        userData = decoded.student || {}
        break
      case 'Admin':
        userData = decoded.admin || {}
        break
      case 'Teacher':
        userData = decoded.teacher || {}
        break
      case 'StaffLibrary':
        userData = decoded.staffLibrary || {}
        break
      case 'Executive':
        userData = decoded.executive || {}
        break
      case 'StaffFaculty':
        userData = decoded.staffFaculty || {}
        break
      default:
        console.warn('⚠️ Unknown role:', decoded.role)
    }

    if (!userData || Object.keys(userData).length === 0) {
      console.error('❌ No user data available for the role:', decoded.role)
      return
    }

    user.value = {
      Prefix: userData.user_prefix || '-',
      FirstName: userData.user_firstName || '-',
      LastName: userData.user_lastName || '-',
      Role: userData.duty_name || '-',
      Faculty: userData.faculty_name || '-',
      Department: userData.department_name || '-',
      Tel: decoded.tel || '-',
      Email: decoded.email || '-',
      User: userId,
    }

    console.log('✅ User Data:', user.value)

    // อัปเดต book.value จาก user.value
    Object.assign(book.value, user.value)
    console.log('📌 Book Updated:', book.value)
  } catch (error) {
    console.error('❌ Token decoding error:', error)
  }
}

const confirmForm = async (bookForm: any) => {
  try {
    // ตรวจสอบว่า userId ถูกตั้งค่าถูกต้องแล้ว
    const userId = book.value.User || user.value.User
    if (!userId) {
      console.error('❌ User ID is null! Cannot proceed.')
      alert('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่')
      await fetchUserData() // รีเฟรชข้อมูลผู้ใช้ใหม่
      return
    }

    const bookQuantity = book.value.Count ? Number(book.value.Count) : 1
    const bookPrice = book.value.Price ? Number(book.value.Price) : 0

    const formData = {
      user_name: `${book.value.Prefix} ${book.value.FirstName} ${book.value.LastName}`.trim(),
      user_email: book.value.Email || 'ไม่พบอีเมล',
      user_tel: book.value.Tel || 'ไม่พบเบอร์โทร',
      book_title: book.value.Title,
      book_author: book.value.Author,
      book_course: book.value.Course || 'ไม่ระบุ',
      book_category: 'เสนอหนังสือทั่วไป',
      ISBN: book.value.isbn || '',
      book_price: bookPrice || 0,
      book_quantity: bookQuantity || 0,
      user_id: userId,
      coupon_used: book.value.Coupon || false,
      form_description: book.value.Details || 'ไม่มีรายละเอียด',
    }

    console.log('✅ Form Data:', formData)

    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('❌ Token ไม่ถูกต้องหรือหมดอายุ')
    }

    // ตรวจสอบข้อมูลผู้ใช้ก่อนที่จะดำเนินการ
    const oldUserData = await axios.get(`http://bookfair.buu.in.th:8043/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const oldUser = oldUserData.data

    if (book.value.Tel !== oldUser.user_tel || book.value.Email !== oldUser.user_email) {
      await axios.patch(
        `http://bookfair.buu.in.th:8043/users/${userId}`,
        {
          user_email: book.value.Email,
          user_tel: book.value.Tel,
        },
        {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        },
      )
      console.log('✅ User data updated successfully')
    }

    const response = await axios.post('http://bookfair.buu.in.th:8043/offer-forms-onl', formData, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })

    console.log('✅ Response:', response.data)
    submitted.value = true
    dialog.value = false
    successdialog.value = true

    await fetchUserData() // รีเฟรชข้อมูลผู้ใช้ใหม่
    resetForm(bookForm)
  } catch (error) {
    console.error('❌ Error submitting form:', error)
    if (error.response) {
      console.error('🚨 API Error Details:', error.response.data)
    }
  }
}

const submitForm = async () => {
  const form = bookForm.value
  if (form && typeof form.validate === 'function') {
    const { valid } = await form.validate()

    if (valid) {
      // ตรวจสอบว่า book.Count มีค่าแล้วหรือไม่ ถ้าไม่มีให้ตั้งค่าเป็น 1
      if (!book.value.Count) {
        book.value.Count = 1
      }

      // ตรวจสอบ ISBN ซ้ำ
      const duplicate = await checkDuplicateISBN(book.value.isbn)
      isDuplicate.value = duplicate

      if (duplicate) {
        // ถ้ามีการซ้ำ แสดงข้อความแจ้งเตือน
        confirmMessage.value = `"${book.value.Title}" เคยมีการเสนอแล้ว ต้องการจะเสนอซ้ำหรือไม่?`
      } else {
        // ถ้าไม่ซ้ำ แสดงข้อความยืนยันการส่งฟอร์ม
        confirmMessage.value = 'ยืนยันการส่งแบบฟอร์ม'
      }

      dialog.value = true // แสดง dialog
    } else {
      console.log('Validation Failed')
    }
  } else {
    console.error('Form reference is invalid or validate is not a function')
  }
}

const checkDuplicateISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://bookfair.buu.in.th:8043/offer-forms-onl?isbn=${isbn}`)
    console.log('API Response:', response.data)

    // ตรวจสอบว่า response.data เป็น array และไม่ว่าง
    if (Array.isArray(response.data) && response.data.length > 0) {
      // ตรวจสอบว่ามีข้อมูล ISBN ที่ตรงกันหรือไม่
      for (let offer of response.data) {
        if (offer.ISBN === isbn) {
          return true // ISBN ซ้ำ
        }
      }
    }

    return false // ไม่มี ISBN ซ้ำ
  } catch (error) {
    console.error('Error checking duplicate ISBN:', error)
    return false // หากเกิดข้อผิดพลาดให้ถือว่าไม่มี ISBN ซ้ำ
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
    Title: '',
    Author: '',
    Year: '',
    isbn: '',
    Course: '',
    Count: null,
  }

  // เปิด validation อีกครั้ง
  setTimeout(() => {
    disableValidation.value = false
  }, 0)

  // รีเซ็ต validation (ลบข้อความ alert validation)
  bookForm.resetValidation() // ใช้ bookForm ในการเรียก resetValidation

  submitted.value = false // รีเซ็ตสถานะการส่งฟอร์ม
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
      const response = await axios.post('http://bookfair.buu.in.th:8044/auth/refresh', {
        refreshToken,
      })
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
  console.log('Component mounted', book.value)
  // await Promise.all([fetchFaculties(), fetchDepartments()])
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
  width: 600px;
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
  /* pointer-events: none; ปิดการโต้ตอบ */
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
