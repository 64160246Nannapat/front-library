<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <input type="text" placeholder="Username" v-model="username" />
      <input type="password" placeholder="Password" v-model="password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login } from '../store/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const loginUser = () => {
  // สมมติว่า login สำเร็จ
  login()
  router.push('/book-form') // หลังจาก login สำเร็จ จะไปที่หน้า BookForm
}
</script>
