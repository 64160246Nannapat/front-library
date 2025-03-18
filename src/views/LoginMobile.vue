<template>
  <v-main class="pink-background">
    <v-container class="container">
      <v-row justify="center">
        <!-- รูปภาพ -->
        <v-col cols="12" md="6" class="d-flex justify-center">
          <img class="image" src="@/assets/login.png" alt="Login Image" />
        </v-col>

        <!-- แบบฟอร์ม -->
        <v-col cols="12" md="6" class="text">
          <div class="heading">Book Suggestion for Purchase</div>
          <div class="subheading">Burapha University</div>

          <div class="form-container">
            <v-row @keydown.enter="login">
              <v-col cols="12">
                <v-text-field
                  label="Username"
                  v-model="username"
                  density="compact"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  class="custom-field"
                  :error-messages="usernameError"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Password"
                  v-model="password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  density="compact"
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                  class="custom-field"
                  :error-messages="passwordError"
                ></v-text-field>
              </v-col>

              <v-col cols="12" class="d-flex justify-center">
                <v-btn class="custom-btn" block @click="login"> Log In </v-btn>
              </v-col>

              <v-col cols="12" class="text-center">
                <span class="custom-text">
                  ***USERNAME และ PASSWORD ที่ใช้เครือข่ายอินเทอร์เน็ตของมหาวิทยาลัย***
                </span>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import LZString from 'lz-string'

const username = ref('')
const password = ref('')
const visible = ref(false)
const usernameError = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const errorMessage = ref<string | null>(null) 
const route = useRoute()
const router = useRouter()

const scannedData = ref<any>(null) // ใช้สำหรับเก็บข้อมูล QR Code ที่ถอดรหัสแล้ว

const login = async () => {
  usernameError.value = null
  passwordError.value = null

  if (!username.value) usernameError.value = 'กรุณากรอกชื่อผู้ใช้'
  if (!password.value) passwordError.value = 'กรุณากรอกรหัสผ่าน'

  if (usernameError.value || passwordError.value) return

  try {
    const response = await axios.post('http://bookfair.buu.in.th:8043/auth/login', {
      username: username.value,
      password: password.value,
    })

    const { access_token, refresh_token, role, user } = response.data

    if (access_token && refresh_token) {
      localStorage.setItem('token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('userData', JSON.stringify(user))
    }

    if (role === 'Store') {
      // ส่งข้อมูล QR Code ไปกับ query เมื่อ login สำเร็จ
      router.push({
        path: '/book-form-shop',
        query: { data: LZString.compressToEncodedURIComponent(JSON.stringify(scannedData.value)) }
      })
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
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
    }
  }
}

// ถอดรหัสข้อมูล QR จาก route.query เมื่อ mounted
onMounted(() => {
  const data = route.query.data
  if (data && typeof data === 'string') {
    try {
      const decodedString = LZString.decompressFromEncodedURIComponent(data)
      scannedData.value = JSON.parse(decodedString)
      console.log('✅ ข้อมูลจาก QR Code:', scannedData.value)
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการแปลงข้อมูล QR Code:', error, data)
    }
  }
})
</script>


<style scoped>
/* พื้นหลัง */
.pink-background {
  background-color: #ffe9e5;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Container */
.container {
  max-width: 900px;
  width: 100%;
  padding: 20px;
}

/* รูปภาพ */
.image {
  max-width: 70%;
  height: auto;
}

/* จัดการข้อความ */
.text {
  text-align: center;
}

/* หัวข้อ */
.heading {
  font-size: 2rem;
  font-weight: bold;
  color: #d6bd98;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
}

/* หัวข้อรอง */
.subheading {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d6bd98;
  margin-bottom: 20px;
}

/* ช่องกรอกข้อมูล */
.custom-field {
  width: 100%;
}

/* ปุ่มล็อกอิน */
.custom-btn {
  font-size: 16px;
  font-weight: bold;
  background-color: #f3beba;
  color: white;
  text-transform: uppercase;
  border-radius: 15px;
  width: 100%;
  height: 50px;
}

/* ข้อความหมายเหตุ */
.custom-text {
  font-size: 14px;
  color: #a87e60;
}

/* Responsive Design */
@media (max-width: 600px) {
  .heading {
    font-size: 1.5rem;
  }

  .subheading {
    font-size: 1.2rem;
  }

  .custom-btn {
    font-size: 14px;
    height: 45px;
  }
}
</style>
