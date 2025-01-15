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
import SumBook from '@/components/executive/SumBook.vue'
import ManageSellBook from '@/components/library/ManageSellBook.vue';
import CheckBook from '@/components/library/CheckBook.vue'
import PurchaseBudget from '@/components/library/PurchaseBudget.vue'
import AddShop from '@/components/library/AddShop.vue'
import ShowShop from '@/components/library/ShowShop.vue'
import ListBook from '@/components/library/ListOfBook.vue'
import ShowBook from '@/components/library/ShowBook.vue'

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
      {
        path: 'coupon',
        name: 'couponTeacher',
        component: Coupon,
      },
      {
        path: 'history-coupon',
        name: 'historyCouponTeacher',
        component: HistoryCoupon,
      },
    ],
    meta: { requiresAuth: true, role: 'teacher' },
  },
  {
    path: '/home-shop',
    name: 'homeShop',
    component: HomeShop,
    children: [
      {
        path: 'history-sell',
        name: 'historySellShop',
        component: HistorySell,
      },
      {
        path: 'manage-book',
        name: 'manageBookShop',
        component: ManageBook,
      },
    ],
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
      {
        path: 'coupon',
        name: 'couponFaculty',
        component: Coupon,
      },
      {
        path: 'history-coupon',
        name: 'historyCouponFaculty',
        component: HistoryCoupon,
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
        path: 'book-form/:itemId',
        name: 'BookFormLibraryWithId',
        component: BookForm,
      },
      {
        path: 'book-status',
        name: 'bookstatusLibrary',
        component: BookStatus,
      },
      {
        path: 'manage-sell-book',
        name: 'ManageSellBookLibrary',
        component: ManageSellBook,
      },
      {
        path: 'check-book',
        name: 'checkBookLibrary',
        component: CheckBook,
      },
      {
        path: 'purchase-budget',
        name: 'purchaseBudgetLibrary',
        component: PurchaseBudget,
      },
      {
        path: 'add-shop',
        name: 'addShopLibrary',
        component: AddShop,
      },
      {
        path: 'show-shop',
        name: 'showShopLibrary',
        component: ShowShop,
      },
      {
        path: 'list-book-presenters',
        name: 'listBookLibrary',
        component: ListBook,
      },
      {
        path: '/show-book/:itemId',
        name: 'showBookLibrary',
        component: ShowBook
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
      {
        path: 'sum-book',
        name: 'sumBookExecutive',
        component: SumBook,
      },
      {
        path: 'coupon',
        name: 'couponExecutive',
        component: Coupon,
      },
      {
        path: 'history-coupon',
        name: 'historyCouponExecutive',
        component: HistoryCoupon,
      },
      {
        path: 'history-coupon',
        name: 'historyCouponExecutive',
        component: HistoryCoupon,
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
  {
    path: '/sum-book',
    name: 'sumBook',
    component: SumBook,
  },
  {
    path: '/manage-sell-book',
    name: 'ManageSellBook',
    component: ManageSellBook,
  },
  {
    path: '/check-book',
    name: 'checkBook',
    component: CheckBook,
  },
  {
    path: '/purchase-budget',
    name: 'purchaseBudget',
    component: PurchaseBudget,
  },
  {
    path: '/purchase-budget',
    name: 'purchaseBudget',
    component: PurchaseBudget,
  },
  {
    path: '/add-shop',
    name: 'addShop',
    component: AddShop,
  },
  {
    path: '/show-shop',
    name: 'showShop',
    component: ShowShop,
  },
  {
    path: '/list-book-presenters',
    name: 'listBook',
    component: ListBook,
  },
  {
    path: '/show-book-presenters',
    name: 'showBook',
    component: ShowBook,
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
