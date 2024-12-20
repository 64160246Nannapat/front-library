import http from './axios' // ใช้ Axios instance ที่ตั้งค่าไว้แล้ว

export default {
  async login(username: string, password: string) {
    return http.post('/auth/login', { username, password })
  },
}
