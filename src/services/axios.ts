import axios from 'axios';

// สร้าง instance ของ Axios
const instance = axios.create({
  baseURL: 'http://localhost:3000', // ชี้ไปที่ Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// แนบ Token (ถ้ามี) ไปกับทุกคำขอ
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
