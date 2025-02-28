<template>
  <v-main class="pink-background">
    <div class="container">
      <img class="image" src="@/assets/login.png" alt="Login Image" />
      <div class="text">
        <div class="heading">Book Suggestion for Purchase</div>
        <div class="subheading">Burapha University</div>

        <div class="form-container">
          <v-row @keydown.enter="login">

            <!-- ช่องกรอกชื่อผู้ใช้ -->
            <v-col cols="12">
              <v-text-field
                label="Username"
                v-model="username"
                density="compact"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                class="mt-16 custom-field custom-usepass text-justify text-input v-text-field form-row"
                :error-messages="usernameError"
              ></v-text-field>
              <div v-if="usernameError" class="error-message">
                {{ usernameError }}
              </div>
            </v-col>

            <!-- ช่องกรอกรหัสผ่าน -->
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
                class="custom-field custom-usepass mg-ps text-justify text-input v-text-field form-row"
                :error-messages="passwordError"
              ></v-text-field>
              <div v-if="passwordError" class="error-message">
                {{ passwordError }}
              </div>
            </v-col>

            <!-- ปุ่มเข้าสู่ระบบ -->
            <v-col cols="8">
              <v-btn class="mb-8 custom-btn custom-login" variant="tonal" block @click="login">
                Log In
              </v-btn>
            </v-col>

            <!-- คำอธิบาย -->
            <v-col>
              <v-text class="custom-text" style="color: #a87e60">
                ***USERNAME และ PASSWORD ที่เข้าใช้เครือข่ายอินเทอร์เน็ตของมหาวิทยาลัย***
              </v-text>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const visible = ref(false)
const errorMessage = ref('')
const usernameError = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const router = useRouter()

const login = async () => {
  usernameError.value = null
  passwordError.value = null

  if (!username.value) {
    usernameError.value = 'กรุณากรอกชื่อผู้ใช้'
  }
  if (!password.value) {
    passwordError.value = 'กรุณากรอกรหัสผ่าน'
  }
  if (usernameError.value || passwordError.value) {
    return
  }

  try {
    const response = await axios.post('http://bookfair.buu.in.th:8043/auth/login', {
      username: username.value,
      password: password.value,
    })

    const { access_token, refresh_token, role } = response.data

    if (access_token && refresh_token) {
      localStorage.setItem('token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
    }

    switch (role) {
      case 'Executive':
        router.push('/home-executive/sum-book')
        break
      case 'Admin':
        router.push('/home-admin/manage-sell-book')
        break
      case 'StaffLibrary':
        router.push('/home-library/manage-sell-book')
        break
      case 'StaffFaculty':
        router.push('/home-faculty/manage-budget')
        break
      case 'StaffDepartment':
        router.push('/home-faculty/manage-budget')
        break
      case 'Teacher':
        router.push('/home-teacher/coupon')
        break
      case 'Student':
        router.push('/home-student/book-form')
        break
      case 'Store':
        router.push('/home-shop/dash-board')
        break
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error)
      if (error.response && error.response.status === 401) {
        const errorData = error.response.data
        if (errorData.invalidUsername) {
          usernameError.value = 'ชื่อผู้ใช้ไม่ถูกต้อง'

          username.value = ''
          password.value = ''
        } else if (errorData.invalidPassword) {
          passwordError.value = 'รหัสผ่านไม่ถูกต้อง'
          usernameError.value = null

          password.value = ''
        } else {
          usernameError.value = 'ชื่อผู้ใช้ไม่ถูกต้อง'
          passwordError.value = 'รหัสผ่านไม่ถูกต้อง'

          username.value = ''
          password.value = ''
        }
      } else {
        errorMessage.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์'
      }
    } else {
      errorMessage.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
      console.error('Unexpected Error:', error)
    }
  }
}
</script>

<style scoped>
.pink-background {
  background-color: #ffe9e5;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.image {
  max-width: 1200px; /* ขนาดสูงสุดของรูปภาพ */
  width: 60%; /* ขยายรูปให้เหมาะสมกับหน้าจอ */
  height: auto;
  margin-left: 200px;
}

.text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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

.v-text-field {
  width: 600px; /* กำหนดความกว้างของช่องกรอกข้อมูล */
  height: 65px;
}

.custom-field {
  margin-left: 180px;
  width: 600px;
  height: 100px;
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
  width: 600px; /* ปรับความกว้างกรอบให้เท่ากับความยาวของข้อความ Book Suggestion for Purchase */
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

.form-row {
  margin-right: 160px;
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
  font-size: 20px;
  font-weight: bold;
  background-color: #f3beba;
  color: #ffffff;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  width: 300px;
  height: 60px;
  padding: 10px 20px;
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
