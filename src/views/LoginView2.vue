<template>
<<<<<<< HEAD
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div>
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      try {
        // ส่งข้อมูล username และ password ไปที่ backend
        const response = await axios.post('http://localhost:3000/auth/login', {
          username: this.username,
          password: this.password,
        });

        // รับค่า access token จาก backend
        const { access_token, refresh_token } = response.data;

        // เก็บ token ไว้ใน localStorage หรือ cookie
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // รีไดเรกต์ไปหน้า dashboard หรือหน้าอื่น ๆ
        this.$router.push('/home-student/book-form');
      } catch {
        // ถ้าเกิดข้อผิดพลาดจากการ login
        this.error = 'Invalid username or password';
      }
    },
  },
};
</script>

<style scoped>
/* สไตล์เพิ่มเติมสำหรับหน้า login */
.login-container {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

h1 {
  text-align: center;
}

form div {
  margin-bottom: 10px;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  text-align: center;
}
</style>


<!-- <template>
  <div>
    <h1>เข้าสู่ระบบ</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="อีเมล" required />
      <input v-model="password" type="password" placeholder="รหัสผ่าน" required />
      <button type="submit">เข้าสู่ระบบ</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// ใช้ Hook สำหรับจัดการการล็อกอิน
const email = ref('')
const password = ref('')
const router = useRouter()

const login = () => {
  // ทำการล็อกอิน (ตัวอย่างโดยใช้ localStorage หรือ Axios)
  localStorage.setItem('authToken', 'yourAuthToken') // ตั้งค่าการล็อกอินสำเร็จ
  router.push('/') // redirect กลับไปที่หน้า Home หรือที่ต้องการ
}
</script> -->
=======
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Username:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'

const username = ref('')
const password = ref('')
const userStore = useUserStore()

const handleLogin = async () => {
  console.log('Logging in with:', username.value, password.value)
  await userStore.login(username.value, password.value)
}

const error = computed(() => userStore.error)
</script>
>>>>>>> master
