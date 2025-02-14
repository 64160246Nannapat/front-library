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
            <v-card-subtitle class="card-money-subtitle">
              {{ user.e_coupon_balance }} บาท
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

      <!-- Coupon Section -->
      <v-row justify="center" class="mt-10">
        <v-card class="mx-auto text-white coupon-card" color="#EF9595">
          <template v-slot:prepend>
            <v-avatar
              color="grey-darken-3"
              size="x-large"
              image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
            ></v-avatar>
          </template>

          <v-card-text class="text-h5 py-2">
            <!-- เรียกใช้งาน QRCode Component -->
            <QRCode
              :text="'E-Coupon คงเหลือ: ' + user.e_coupon_balance + ' บาท'"
              @click="goToBookForm"
            />
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
              <v-list-item-title class="text-card">{{ user.e_coupon_balance }}</v-list-item-title>
              <v-list-item-title class="text-card">บาท</v-list-item-title>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCode from '@/views/QRCode.vue' // แก้พาธให้ถูกต้อง
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// เก็บข้อมูลของ User
const user = ref({
  id: '',
  prefix: '',
  firstname: '',
  lastname: '',
  faculty_name: '',
  department_name: '',
  e_coupon_balance: 0,
})

const loading = ref(true) // ใช้แสดงระหว่างโหลดข้อมูล
const errorMessage = ref('') // เก็บข้อความ Error ถ้าโหลดไม่ได้

// ฟังก์ชันดึงข้อมูลผู้ใช้
const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      errorMessage.value = 'Token ไม่พบ กรุณาล็อกอินใหม่'
      return
    }

    console.log('🔹 กำลังดึงข้อมูลผู้ใช้...')

    const userResponse = await axios.get('http://localhost:3000/user', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (userResponse.status === 200 && userResponse.data) {
      user.value = userResponse.data

      // ✅ ดึง E-Coupon เฉพาะของผู้ใช้ที่ล็อกอินอยู่
      const couponResponse = await axios.get('http://localhost:3000/e-coupon/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (couponResponse.status === 200 && couponResponse.data) {
        user.value.e_coupon_balance = couponResponse.data.balance
      } else {
        user.value.e_coupon_balance = 0
      }
    } else {
      errorMessage.value = 'ไม่สามารถดึงข้อมูลผู้ใช้ได้'
    }
  } catch (error) {
    console.error('❌ ดึงข้อมูลไม่สำเร็จ:', error)
    errorMessage.value = 'เกิดข้อผิดพลาดในการดึงข้อมูล'
  } finally {
    loading.value = false
  }
}

// ฟังก์ชันกดไปยังหน้าจองคูปอง
const goToBookForm = () => {
  router.push('/book-form-shop')
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
  border-radius: 16px;
  width: 400px;
  height: 630px;
  padding: 20px;
  text-align: center;
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
</style>
