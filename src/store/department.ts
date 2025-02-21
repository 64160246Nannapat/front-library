import { defineStore } from 'pinia';
import { ref } from 'vue';
import departmentService from '@/services/department';

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<{
    department_id: number;
    department_name: string;
    faculty_id?: number;
  }[]>([]);
  const error = ref('');

  // ฟังก์ชันโหลด Departments ทั้งหมด
  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getDepartments();
      departments.value = response.data;
    } catch (err: any) {
      console.error('Error fetching departments:', err);
      error.value = 'Failed to fetch departments';
    }
  };

  return {
    departments,
    error,
    fetchDepartments,
  };
});
