import { defineStore } from 'pinia';
import { ref } from 'vue';
import facultyService from '@/services/faculty';

export const useFacultyStore = defineStore('faculty', () => {
  const faculties = ref<{
    faculty_id: number;
    faculty_name: string;
  }[]>([]);
  const error = ref('');

  // ฟังก์ชันโหลด Faculties ทั้งหมด
  const fetchFaculties = async () => {
    try {
      const response = await facultyService.getFaculties();
      faculties.value = response.data;
    } catch (err: any) {
      console.error('Error fetching faculties:', err);
      error.value = 'Failed to fetch faculties';
    }
  };

  return {
    faculties,
    error,
    fetchFaculties,
  };
});
