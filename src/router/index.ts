import { createRouter, createWebHistory } from 'vue-router'
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
import Coupon from '@/components/Coupon.vue'
import HistoryCoupon from '@/components/HistoryCoupon.vue'
import HistorySell from '@/components/shop/HistorySell.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/home-student',
    name: 'homestudent',
    component: HomeStudent,
    children: [
      {
        path: 'book-form',
        name: 'BookFormStudent',
        component: BookForm,
      },
      {
        path: 'book-status',
        name: 'bookstatusStudent',
        component: BookStatus,
      },
    ],
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
    children: [
      {
        path: 'book-form',
        name: 'BookFormTeacher',
        component: BookForm,
      },
      {
        path: 'book-status',
        name: 'bookstatusTeacher',
        component: BookStatus,
      },
    ],
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
    children: [
      {
        path: 'book-form',
        name: 'BookFormFaculty',
        component: BookForm,
      },
      {
        path: 'book-status',
        name: 'bookstatusFaculty',
        component: BookStatus,
      },
    ],
    meta: { requiresAuth: true, role: 'faculty' },
  },
  {
    path: '/home-library',
    name: 'homeLibrary',
    component: HomeLibrary,
    children: [
      {
        path: 'book-form',
        name: 'BookFormLibrary',
        component: BookForm,
      },
      {
        path: 'book-status',
        name: 'bookstatusLibrary',
        component: BookStatus,
      },
    ],
    meta: { requiresAuth: true, role: 'library' },
  },
  {
    path: '/home-executive',
    name: 'homeExecutive',
    component: HomeExecutive,
    children: [
      {
        path: 'book-form',
        name: 'BookFormExecutive',
        component: BookForm,
      },
      {
        path: 'book-status',
        name: 'bookstatusExecutive',
        component: BookStatus,
      },
    ],
    meta: { requiresAuth: true, role: 'executive' },
  },
  {
    path: '/home-admin',
    name: 'homeAdmin',
    component: HomeAdmin,
    children: [
      {
        path: 'book-form',
        name: 'BookFormAdmin',
        component: BookForm,
      },
      {
        path: 'book-status',
        name: 'bookstatusAdmin',
        component: BookStatus,
      },
    ],
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/manage-book',
    name: 'manageBook',
    component: ManageBook,
  },
  {
    path: '/history-sell',
    name: 'historySell',
    component: HistorySell,
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: Coupon,
  },
  {
    path: '/history-coupon',
    name: 'historyCoupon',
    component: HistoryCoupon,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
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
