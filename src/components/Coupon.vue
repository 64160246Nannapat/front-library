<template>
  <v-main style="height: 500px; margin-top: 25px">
    <v-container class="ecoupon-container">
      <!-- Header -->
      <v-row align="center" justify="space-between">
        <v-col>
          <div class="header">
            <img class="header-image" src="@/assets/budget-color.png" alt="Budget" />
            <h1>E-Coupon</h1>
          </div>
        </v-col>
        <v-col>
          <v-card class="mx-auto card-money justify-end">
            <v-card-title class="card-money-title">E-coupon คงเหลือ</v-card-title>
            <v-card-subtitle class="card-money-subtitle"> {{ user.e_coupon }} บาท </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

      <!-- Coupon Section -->
      <v-row justify="center" class="mt-10">
        <v-card class="mx-auto text-white coupon-card" color="#EF9595">
          <v-card-text
            class="text-h5 py-2 d-flex justify-start align-center"
            style="padding-left: 10px"
          >
            <!-- เรียกใช้งาน QRCode Component -->
            <div class="qrcode-container">
              <QRCode :user="user" />
            </div>
          </v-card-text>

          <v-card-actions>
            <v-list-item class="w-100">
              <v-list-item-title class="text-card">
                {{ user.prefix }} {{ user.firstname }} {{ user.lastname || 'ไม่ทราบชื่อ' }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-card-sub">
                {{ user.faculty_name || 'ไม่ทราบคณะ' }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-card-sub text-magin">
                {{ user.department_name || 'ไม่ทราบภาควิชา' }}
              </v-list-item-subtitle>
              <v-list-item-title class="text-card">
                {{ user.e_coupon }}
              </v-list-item-title>
              <v-list-item-title class="text-card">บาท</v-list-item-title>
            </v-list-item>
          </v-card-actions>

          <div class="dashed-separator"></div>
        </v-card>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCode from '@/views/QRCode.vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const isReadonly = ref(false)
const loading = ref(true) // สถานะการโหลดข้อมูล
const errorMessage = ref('') // เก็บข้อความ Error ถ้าโหลดไม่ได้

const user = ref({
  user_id: '',
  prefix: '',
  firstname: '',
  lastname: '',
  role_offer: '',
  tel: '',
  email: '',
  faculty_id: '',
  department_id: '',
  faculty_name: '',
  department_name: '',
  e_coupon: 0, // เพิ่ม e_coupon ที่จะใช้งาน
})

const router = useRouter()

// ฟังก์ชันดึงข้อมูลผู้ใช้
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
      console.log('Decoded Token:', decoded) // ตรวจสอบค่าที่ decode ออกมา
      userId = decoded.sub

      // ตรวจสอบ role แล้วเลือกข้อมูลให้ถูกต้อง
      let userData = {}
      switch (decoded.role) {
        case 'Teacher':
          userData = decoded.teacher || {}
          break
        default:
          console.warn('Unknown role:', decoded.role)
      }
      console.log('User Data:', userData) // ดูข้อมูลใน userData ที่ดึงมา

      // กำหนดค่าให้ user.value รวมถึง tel และ email
      user.value = {
        user_id: userData.user_id || '-',
        prefix: userData.user_prefix || '-',
        firstname: userData.user_firstName || '-',
        lastname: userData.user_lastName || '-',
        role_offer: userData.role_offer || '-',
        tel: decoded.tel || '-', // ดึง tel จาก decoded
        email: decoded.email || '-', // ดึง email จาก decoded
        faculty_id: userData.faculty_id || '-',
        department_id: userData.department_id || '-',
        faculty_name: userData.faculty_name || 'ไม่ระบุคณะ',
        department_name: userData.department_name || 'ไม่ระบุสาขาวิชา',
        e_coupon: userData.e_coupon || 0, // ให้ e_coupon มีค่า
      }
    }

    if (!user.value.prefix) {
      console.error('Error: User data is incomplete.')
    }

    loading.value = false // เมื่อโหลดข้อมูลเสร็จ
    isReadonly.value = true
  } catch (error) {
    console.error('Token decoding error:', error)
    errorMessage.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้'
    loading.value = false
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

onMounted(fetchUserData)
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

.ecoupon-container {
  height: 100vh;
  padding: 20px;
}

.coupon-card {
  background-color: #ef9595;
  width: 400px;
  height: 650px;
  padding: 20px;
  text-align: center;
  position: relative;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* กึ่งกลางแนวตั้ง */
}

/* สร้างรอยเว้า */
.coupon-card::before,
.coupon-card::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 40px;
  background:
    radial-gradient(circle at 20px 20px, white 20px, transparent 21px),
    radial-gradient(circle at 80px 20px, white 20px, transparent 21px),
    radial-gradient(circle at 140px 20px, white 20px, transparent 21px),
    radial-gradient(circle at 200px 20px, white 20px, transparent 21px),
    radial-gradient(circle at 260px 20px, white 20px, transparent 21px);
  background-size: 60px 60px;
  background-repeat: repeat-x;
}

/* รอยเว้าด้านบน */
.coupon-card::before {
  top: -20px;
}

/* รอยเว้าด้านล่าง */
.coupon-card::after {
  bottom: -20px;
  transform: rotate(180deg);
}

.card-money {
  background-color: #e0e6f0;
  height: 110px;
  width: 600px;
  max-width: 340px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-money-title {
  font-size: 24px;
  font-weight: bold;
  color: #000;
}

.card-money-subtitle {
  font-size: 20px;
  color: #666;
  margin-bottom: 10px;
}

.text-card {
  font-size: 25px;
  color: #000;
}

.text-card-sub {
  font-size: 18px;
  color: #000;
  margin-top: 8px;
}

.text-magin {
  margin-bottom: 60px;
}

.dashed-separator {
  width: 95%;
  height: 2px;
  border-bottom: 5px dashed white;
  border-image: repeating-linear-gradient(
      to right,
      white 0%,
      white 50px,
      /* ความยาวของแต่ละจุด */ transparent 50px,
      transparent 60px /* ระยะห่างระหว่างจุด */
    )
    10;
  margin: 20px auto;
}

.v-list-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* กึ่งกลางแนวตั้ง */
  align-items: center; /* กึ่งกลางแนวนอน */
}

.text-card,
.text-card-sub {
  text-align: center; /* กึ่งกลางข้อความ */
}

.qrcode-container {
  display: flex;
  justify-content: flex-start; /* จัดชิดซ้าย */
  align-items: center;
  width: 100%;
  margin: 10px 0;
  margin-left: -20px;
}

.qrcode-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
}

.qrcode {
  width: 230px;
  height: 230px;
  border-radius: 10px;
  padding: 5px;
}
</style>
