<template>
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
