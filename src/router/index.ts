import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import BookFormStudent from '../components/student/BookFormStudent.vue'
import BookStatusStudent from '@/components/student/BookStatusStudent.vue'
import HomeStudent from '@/components/student/HomeStudent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home-student',
      component: HomeStudent,
    },
    {
      path: '/book-form-student',
      name: 'bookFormStudent',
      component: BookFormStudent,
    },
    {
      path: '/book-status-student',
      name: 'bookstatusStudent',
      component: BookStatusStudent,
    },
  ],
})

export default router
