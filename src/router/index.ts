import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import BookForm from '../components/BookForm.vue'
import BookStatus from '@/components/BookStatus.vue'
import HomeStudent from '@/components/student/HomeStudent.vue'
import Login from '@/views/LoginView.vue'
import HomeTeacher from '@/components/teacher/HomeTeacher.vue'
import HomeShop from '@/components/shop/HomeShop.vue'
import HomeFaculty from '@/components/faculty/HomeFaculty.vue'
import HomeLibrary from '@/components/library/HomeLibrary.vue'
import HomeExecutive from '@/components/executive/HomeExecutive.vue'
import HomeAdmin from '@/components/admin/HomeAdmin.vue'
import ManageBook from '@/components/shop/ManageBook.vue'
import LoginView2 from '@/views/LoginView2.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/home-student',
      name: 'homestudent',
      component: HomeStudent,
      meta: { requiresAuth: true, role: 'student' },
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
    {
      path: '/home-teacher',
      name: 'homeTeacher',
      component: HomeTeacher,
      meta: { requiresAuth: true, role: 'teacher' },
    },
    {
      path: '/home-shop',
      name: 'homeShop',
      component: HomeShop,
      meta: { requiresAuth: true, role: 'shop' },
    },
    {
      path: '/home-faculty',
      name: 'homeFaculty',
      component: HomeFaculty,
      meta: { requiresAuth: true, role: 'faculty' },
    },
    {
      path: '/home-library',
      name: 'homeLibrary',
      component: HomeLibrary,
      meta: { requiresAuth: true, role: 'library' },
    },
    {
      path: '/home-executive',
      name: 'homeExecutive',
      component: HomeExecutive,
      meta: { requiresAuth: true, role: 'executive' },
    },
    {
      path: '/home-admin',
      name: 'homeAdmin',
      component: HomeAdmin,
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/manage-book',
      name: 'manageBook',
      component: ManageBook,
    },
  ],
})

// // Middleware ตรวจ role ก่อนเข้าสู่ระบบ
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('token') // ตรวจสอบ token
//   const userRole = localStorage.getItem('role') // รับ role ของผู้ใช้จาก storage

//   if (to.meta.requiresAuth) {
//     if (!isAuthenticated) {
//       return next({ name: 'login' })
//     }
//     if (to.meta.role && to.meta.role !== userRole) {
//       return next({ name: 'login' }) // หรือเปลี่ยนเป็นหน้า Error 403
//     }
//   }
//   next()
// })

export default router
