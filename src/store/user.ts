import { defineStore } from 'pinia';
import http from '@/services/axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore('user', () => {
  const user = ref<{ id: number; name: string; role: string } | null>(null);
  const token = ref(localStorage.getItem('access_token') || '');
  const error = ref('');
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      const response = await http.post('/auth/login', { username, password });
      if (response.data && response.data.access_token && response.data.role) {
        user.value = {
          id: response.data.user_id,
          name: response.data.username,
          role: response.data.role,
        };
        token.value = response.data.access_token;
        localStorage.setItem('access_token', token.value);
        router.push('/home-admin');
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Invalid username or password';
    }
  };

  const logout = async () => {
    try {
      await http.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      user.value = null;
      token.value = '';
      localStorage.removeItem('access_token');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return { user, token, error, login, logout };
});
