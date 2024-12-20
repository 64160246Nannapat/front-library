// src/composables/useAuth.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const isLoggedIn = ref(false) // สถานะล็อกอินเริ่มต้นเป็น false
  const router = useRouter()

  // ฟังก์ชันตรวจสอบสถานะล็อกอิน
  function checkLogin() {
    // ตรวจสอบสถานะล็อกอิน (สามารถปรับแต่งการเช็คตามความต้องการ)
    isLoggedIn.value = !!localStorage.getItem('authToken') // ตัวอย่างเช็คจาก localStorage หรือที่อื่น
  }

  function redirectToLogin() {
    if (!isLoggedIn.value) {
      router.push('/login') // ไปที่หน้าเข้าสู่ระบบ
    }
  }

  return { isLoggedIn, checkLogin, redirectToLogin }
}
