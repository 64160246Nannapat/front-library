import http from './axios';

export default {
  async getAllRoles() {
    return http.get('/roles');
  },

  async getRoleById(roleId: number) {
    return http.get(`/roles/${roleId}`);
  },

  async createRole(roleData: any) {
    return http.post('/roles', roleData);
  },

  async updateRole(roleId: number, roleData: any) {
    return http.put(`/roles/${roleId}`, roleData);
  },

  async deleteRole(roleId: number) {
    return http.delete(`/roles/${roleId}`);
  },
};
