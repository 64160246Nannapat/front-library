import { defineStore } from 'pinia';
import { ref } from 'vue';
import roleService from '@/services/roleService';

export const useRoleStore = defineStore('role', () => {
  const roles = ref<{ role_id: number; role_name: string }[]>([]);
  const error = ref('');

  // ฟังก์ชันโหลด Roles ทั้งหมด
  const fetchRoles = async () => {
    try {
      const response = await roleService.getAllRoles();
      roles.value = response.data;
    } catch (err: any) {
      console.error('Error fetching roles:', err);
      error.value = 'Failed to fetch roles';
    }
  };

  return {
    roles,
    error,
    fetchRoles,
  };
});
