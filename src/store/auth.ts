// auth.ts (หรือ store/auth.ts)
import { ref } from 'vue'

export const isAuthenticated = ref(false) // ตัวแปรนี้ใช้เก็บสถานะการเข้าสู่ระบบ

// ฟังก์ชันในการเข้าสู่ระบบ
export const login = () => {
  isAuthenticated.value = true
}

// ฟังก์ชันในการออกจากระบบ
export const logout = () => {
  isAuthenticated.value = false
}
