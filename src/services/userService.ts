import http from './axios';

export default {
  async login(username: string, password: string) {
    return http.post('/auth/login', { username, password });
  },

  async getAllUsers() {
    return http.get('/users');
  },

  async getUserById(userId: number) {
    return http.get(`/users/${userId}`);
  },

  async createUser(userData: any) {
    return http.post('/users', userData);
  },

  async updateUser(userId: number, userData: any) {
    return http.put(`/users/${userId}`, userData);
  },

  async deleteUser(userId: number) {
    return http.delete(`/users/${userId}`);
  },
};
