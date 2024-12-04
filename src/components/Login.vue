<template>
  <v-main class="pink-background">
    <div class="container">
      <img class="image" src="@/assets/login.png" alt="Login Image" />
      <div class="heading-container">
        <div class="heading">Book Suggestion for Purchase</div>
        <div class="subheading">Burapha University</div>

        <v-row>
          <!-- Username -->
          <v-col cols="12">
            <v-text-field
              label="Username"
              v-model="username"
              density="compact"
              placeholder="Email address"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              class="mt-5 custom-field"
              style="height: 100%"
            ></v-text-field>
          </v-col>

          <!-- Password -->
          <v-col cols="12">
            <v-text-field
              label="Password"
              v-model="password"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              placeholder="Enter your password"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              @click:append-inner="visible = !visible"
              class="mt-2 custom-field"
              style="height: 100%"
            ></v-text-field>
          </v-col>

          <v-btn class="mb-8 custom-btn" variant="tonal" block @click="login"> Log In </v-btn>
          <v-text style="text-align: center">
            ***USERNAME และ PASSWORD ที่เข้าใช้เครือข่ายอินเทอร์เน็ตของมหาวิทยาลัย***
          </v-text>
        </v-row>
      </div>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('') // ประกาศตัวแปร username
const password = ref('') // ประกาศตัวแปร password
const visible = ref(false)
const errorMessage = ref('')

const mockUsers = [
  { username: 'admin', password: '123456' },
  { username: 'user1', password: 'password' },
]

const router = useRouter()

const login = () => {
  const user = mockUsers.find(
    (user) => user.username === username.value && user.password === password.value,
  )

  if (user) {
    router.push('/book-form')
  } else {
    errorMessage.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
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
  max-width: 800px; /* เพิ่มขนาดสูงสุดของรูปภาพ */
  width: 100%; /* ให้รูปภาพขยายเต็มความกว้างของคอนเทนเนอร์ */
  height: auto; /* รักษาสัดส่วนของรูป */
  margin-right: 30px; /* เพิ่มระยะห่างจากข้อความ */
}

.heading-container {
  display: flex;
  flex-direction: column; /* เรียงข้อความให้เป็นคอลัมน์ */
  align-items: center; /* จัดให้อยู่กลางในแนวนอน */
  justify-content: center; /* จัดให้อยู่กลางในแนวตั้ง */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
}

.heading {
  font-size: 38px;
  font-weight: bold;
  color: #d6bd98;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
}

.subheading {
  font-size: 30px;
  font-weight: bold;
  color: #d6bd98;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
}

.v-text-field .v-input__control {
  margin-top: 15px;
  height: 80px; /* เพิ่มความสูงให้กรอบ */
}

.custom-field .v-input__control {
  width: 400px; /* ปรับความกว้างกรอบให้เท่ากับความยาวของข้อความ Book Suggestion for Purchase */
  height: 80px; /* เพิ่มความสูงให้กรอบ */
}

.custom-field .v-input__slot {
  height: 100%; /* ทำให้กรอบกรอกข้อมูลเต็มความสูง */
}

.v-text-field input {
  height: 100%; /* ให้กรอกข้อมูลเต็มกรอบ */
  padding-top: 20px; /* เพิ่มระยะห่างจากด้านบน */
  font-size: 16px; /* ปรับขนาดตัวอักษร */
}

.custom-btn {
  font-size: 20px;
  font-weight: bold;
  background-color: #f3beba; /* เปลี่ยนสีพื้นหลัง */
  color: #ffffff; /* เปลี่ยนสีข้อความ */
  width: 100%;
  height: 60px; /* กำหนดความสูงของปุ่ม */
  max-width: 100%; /* จำกัดความกว้างให้ไม่เกินขนาดของคอนเทนเนอร์ */
  text-transform: uppercase; /* ทำให้ข้อความในปุ่มเป็นตัวพิมพ์ใหญ่ */
  display: flex;
  align-items: center; /* จัดตำแหน่งข้อความในปุ่มให้อยู่กลางแนวตั้ง */
  justify-content: center; /* จัดตำแหน่งข้อความในปุ่มให้อยู่กลางแนวนอน */
}
</style>
