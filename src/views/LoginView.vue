<template>
  <v-main class="pink-background">
    <div class="container">
      <img class="image" src="@/assets/login.png" alt="Login Image" />
      <div class="text">
        <div class="heading">Book Suggestion for Purchase</div>
        <div class="subheading">Burapha University</div>

        <v-row>
          <!-- Username -->
          <v-col cols="12">
            <v-text-field
              label="Username"
              v-model="username"
              density="compact"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              class="mt-16 custom-field custom-usepass text-justify text-input v-text-field"
              :error-messages="usernameError"
            ></v-text-field>
            <div v-if="usernameError" class="error-message">
              {{ usernameError }}
            </div>
          </v-col>

          <!-- Password -->
          <v-col cols="12" style="text-align: center">
            <v-text-field
              label="Password"
              v-model="password"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              @click:append-inner="visible = !visible"
              class="custom-field custom-usepass mg-ps text-justify text-input v-text-field"
              :error-messages="passwordError"
            ></v-text-field>
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>
          </v-col>

          <v-col cols="8">
            <v-btn class="mb-8 custom-btn custom-login" variant="tonal" block @click="login">
              Log In
            </v-btn>
          </v-col>

          <v-col>
            <v-text class="custom-text" style="color: #a87e60">
              ***USERNAME และ PASSWORD ที่เข้าใช้เครือข่ายอินเทอร์เน็ตของมหาวิทยาลัย***
            </v-text>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setAuthData } from '@/services/authService'
import axios from 'axios'

const router = useRouter() // ใช้สำหรับเปลี่ยนหน้า
const username = ref('')
const password = ref('')
const visible = ref(false)
const errorMessage = ref('')
const usernameError = ref<string | null>(null)
const passwordError = ref<string | null>(null)

// ฟังก์ชัน Mock Login
const login = () => {
  usernameError.value = null
  passwordError.value = null

  // ตรวจสอบกรอกข้อมูลหรือไม่
  if (!username.value || !password.value) {
    if (!username.value) usernameError.value = 'ชื่อผู้ใช้ไม่ถูกต้อง'
    if (!password.value) passwordError.value = 'รหัสผ่านไม่ถูกต้อง'
    return
  }

  // Mock User
  const mockUsers = {
    student: 'password123',
    teacher: 'password123',
    admin: 'password123',
    shop: 'password123',
    library: 'password123',
    faculty: 'password123',
    executive: 'password123',
  }

  // ตรวจสอบ Username และ Password
  if (mockUsers[username.value] !== password.value) {
    if (mockUsers[username.value] === undefined) {
      usernameError.value = 'ชื่อผู้ใช้ไม่ถูกต้อง'
      passwordError.value = 'รหัสผ่านไม่ถูกต้อง'
      username.value = ''
      password.value = ''
    }
    if (mockUsers[username.value] && mockUsers[username.value] !== password.value) {
      passwordError.value = 'รหัสผ่านไม่ถูกต้อง'
      password.value = ''
    }

    if (usernameError.value || passwordError.value) {
      return
    }
  }

  // Mock Token และ Role
  const token = 'mock-token-12345'
  let role = ''

  // กำหนด role ตาม username
  switch (username.value) {
    case 'student':
      role = 'student'
      break
    case 'teacher':
      role = 'teacher'
      break
    case 'admin':
      role = 'admin'
      break
    case 'shop':
      role = 'shop'
      break
    case 'library':
      role = 'library'
      break
    case 'faculty':
      role = 'faculty'
      break
    case 'executive':
      role = 'executive'
      break
    default:
      errorMessage.value = 'ไม่สามารถเข้าสู่ระบบได้'
      return
  }

  // บันทึก Token และ Role ลงใน localStorage
  setAuthData(token, role)
  // เปลี่ยนเส้นทางไปยังหน้า /home-student/book-form
  if (role === 'student') {
    router.push('/home-student/book-form')
  } else if (role === 'executive') {
    router.push('/home-executive/sum-book')
  } else if (role === 'teacher') {
    router.push('/home-teacher/coupon')
  } else if (role === 'library') {
    router.push('/home-library/manage-sell-book')
  } else {
    router.push(`/home-${role}`)
  }
}
</script>

<style scoped>
.pink-background {
  background-color: #ffe9e5; /* สีชมพู */
  height: 100vh; /* ให้ครอบคลุมทั้งหน้าจอ */
  display: flex; /* ใช้ Flexbox */
  align-items: center; /* จัดให้อยู่กึ่งกลางแนวตั้ง */
  justify-content: center; /* จัดให้อยู่กึ่งกลางแนวนอน */
  position: relative; /* ใช้สำหรับจัดตำแหน่ง */
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  max-width: 1200px; /* เพิ่มขนาดสูงสุดของรูปภาพ */
  width: 100%; /* ให้รูปภาพขยายเต็มความกว้างของคอนเทนเนอร์ */
  height: auto; /* รักษาสัดส่วนของรูป */
  margin-left: 200px; /* เพิ่มระยะห่างจากข้อความ */
}

.text {
  display: flex;
  flex-direction: column; /* เรียงข้อความให้เป็นคอลัมน์ */
  align-items: center; /* จัดให้อยู่กลางในแนวนอน */
  justify-content: center; /* จัดให้อยู่กลางในแนวตั้ง */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
  margin-right: 120px;
}

.heading {
  font-size: 50px;
  font-weight: bold;
  color: #d6bd98;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
}

.subheading {
  font-size: 40px;
  font-weight: bold;
  color: #d6bd98;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
}

.v-text-field .v-input__control {
  display: flex; /* ใช้ flexbox */
  align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
  justify-content: center; /* จัดให้อยู่ตรงกลางแนวนอน */
  height: 56px; /* ปรับความสูงให้พอดี */
  box-sizing: border-box; /* ให้ขนาดรวม padding */
}

.v-input__control {
  display: flex;
  align-items: center; /* จัดให้อยู่กึ่งกลางแนวตั้ง */
  justify-content: flex-start; /* จัดข้อความและไอคอนในแนวเดียวกัน */
  height: 56px; /* ความสูงที่ Vuetify ใช้เป็นค่าเริ่มต้น */
  padding: 0 12px; /* ระยะขอบในกรอบ */
}

.v-input__prepend-inner {
  display: flex;
  align-items: center; /* จัดไอคอนให้อยู่กึ่งกลางแนวตั้ง */
  margin-right: 8px; /* ระยะห่างระหว่างไอคอนและข้อความ */
}

.custom-field .v-input__control {
  width: 400px; /* ปรับความกว้างกรอบให้เท่ากับความยาวของข้อความ Book Suggestion for Purchase */
  height: 100px; /* เพิ่มความสูงให้กรอบ */
}
.custom-usepass {
  margin-left: 180px;
  width: 600px; /* ปรับความกว้างกรอบให้เท่ากับความยาวของข้อความ Book Suggestion for Purchase */
  height: 100px; /* เพิ่มความสูงให้กรอบ */
}

.custom-login {
  margin-left: 170px;
}

.felid-text input {
  align-items: center;
  text-align: center;
  justify-content: center;
}

.custom-text {
  margin-left: 270px;
  display: flex;
  flex-direction: column; /* เรียงข้อความให้เป็นคอลัมน์ */
  align-items: center; /* จัดให้อยู่กลางในแนวนอน */
  justify-content: center; /* จัดให้อยู่กลางในแนวตั้ง */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
  margin-right: 300px;
}

.mg-ps {
  margin-top: -20px;
}

.custom-field .v-input__slot {
  height: 100%; /* ทำให้กรอบกรอกข้อมูลเต็มความสูง */
}

/* ข้อความในช่องกรอก */
.v-text-field input {
  line-height: normal; /* ป้องกันการเลื่อนข้อความ */
  height: 100%; /* ขยายความสูงให้เต็ม */
  margin: 0; /* ยกเลิก margin */
  display: flex;
  align-items: center; /* จัดข้อความให้อยู่ตรงกลาง */
  font-size: 16px; /* ขนาดตัวอักษร */
}

.v-text-field {
  height: 65px; /* ความสูงของกรอบ text field */
}

.text-justify {
  justify-content: center;
  margin-top: 2px;
}

.custom-btn {
  font-size: 20px; /* ขนาดตัวอักษร */
  font-weight: bold; /* ตัวอักษรหนา */
  background-color: #f3beba; /* สีพื้นหลัง */
  color: #ffffff; /* สีตัวอักษร */
  text-transform: uppercase; /* ให้ตัวอักษรเป็นพิมพ์ใหญ่ทั้งหมด */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px; /* ความโค้งของมุม */
  width: 300px; /* กำหนดความกว้าง */
  height: 60px; /* กำหนดความสูง */
  padding: 10px 20px; /* ระยะห่างภายใน */
}

.custom-btn input {
  text-align: center;
  align-items: center;
}

.field-container {
  position: relative; /* ทำให้เป็นจุดอ้างอิงสำหรับข้อความ error */
}

.error-message {
  color: red;
  font-size: 14px;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 2px;
  text-align: left;
  white-space: nowrap; /* ป้องกันข้อความยาวเกินไป */
}

.text-input .v-input__control {
  font-size: 20px !important; /* ตั้งขนาดตัวหนังสือ */
  height: auto; /* รักษาความสูงของช่อง */
}
</style>
