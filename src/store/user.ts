import { defineStore } from 'pinia'
import { ref } from 'vue'
import userService from '@/services/user'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const user = ref<{ id: number; name: string } | null>(null)
  const token = ref(localStorage.getItem('token') || '')
  const error = ref('')

  const router = useRouter()

  const login = async (username: string, password: string) => {
    try {
      const response = await userService.login(username, password)
      console.log('Login Response:', response.data)

      if (response.data && response.data.access_token && response.data.user) {
        user.value = {
          id: response.data.user.id, // ตรวจสอบค่า id จาก response
          name: response.data.user.name, // ตรวจสอบค่า name จาก response
        }
        token.value = response.data.access_token

        localStorage.setItem('token', token.value)
        router.push('/home-admin') // redirect ไปยังหน้า home-admin ตาม role ที่ไม่มี
      } else {
        console.error('Incomplete response data:', response.data)
        error.value = 'Invalid response data'
      }
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.response) {
        console.error('Backend error response:', err.response.data)
        error.value = err.response.data.message || 'Invalid username or password'
      } else {
        error.value = `An error occurred: ${err.message}`
      }
    }
  }

  return {
    user,
    token,
    error,
    login,
  }
})
