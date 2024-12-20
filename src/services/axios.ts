<<<<<<< HEAD
import axios from 'axios';

// ตั้งค่า base URL ของ backend
axios.defaults.baseURL = 'http://localhost:3000/';

// เช็คและแนบ token ที่เก็บใน localStorage ไปกับทุก request
const token = localStorage.getItem('access_token');
if (token) {
  axios.defaults.headers['Authorization'] = `Bearer ${token}`;
}

export default axios;
=======
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000', // ชี้ไปที่ Backend
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance
>>>>>>> master
