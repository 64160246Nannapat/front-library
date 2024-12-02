import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import BookForm from '../components/BookForm.vue'
import BookStatus from '@/components/BookStatus.vue'
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
      path: '/book-form',
      name: 'bookForm',
      component: BookForm,
    },
    {
      path: '/book-status',
      name: 'bookstatus',
      component: BookStatus,
    },
  ],
})

export default router