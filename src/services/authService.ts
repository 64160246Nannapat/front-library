/** บันทึกข้อมูล Token และ Role ลงใน localStorage */
export const setAuthData = (token: string, role: string): void => {
  localStorage.setItem('token', token)
  localStorage.setItem('role', role)
}

/** ดึงข้อมูล Token และ Role จาก localStorage */
export const getAuthData = (): { token: string | null; role: string | null } => {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
  }
}

/** ล้างข้อมูล Token และ Role ออกจาก localStorage */
export const clearAuthData = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
}

/** ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือไม่ */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token')
}

/** ดึง Role ของผู้ใช้ */
export const getUserRole = (): string | null => {
  return localStorage.getItem('role')
}
