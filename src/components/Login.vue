<template>
  <div id="login">
    <h1>เข้าสู่ระบบ</h1>
    <div class="form-group">
      <input v-model="username" type="text" placeholder="ชื่อผู้ใช้" required />
    </div>
    <div class="form-group">
      <input v-model="password" type="password" placeholder="รหัสผ่าน" required />
    </div>
    <button @click="login">เข้าสู่ระบบ</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')

// ข้อมูล mock ผู้ใช้
const mockUsers = [
  { username: 'admin', password: '123456' },
  { username: 'user1', password: 'password' },
]

// ใช้ router จาก vue-router
const router = useRouter()

// ฟังก์ชันในการเข้าสู่ระบบ
const login = () => {
  const user = mockUsers.find(
    (user) => user.username === username.value && user.password === password.value,
  )

  if (user) {
    router.push('/qrcode') // นำไปที่หน้า QR Code
  } else {
    errorMessage.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
  }
}
</script>

<style>
/* CSS เหมือนตัวอย่างก่อนหน้า */
#errorMessage {
  color: red;
  font-size: 14px;
}
</style>
