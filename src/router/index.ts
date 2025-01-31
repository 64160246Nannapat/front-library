import { createRouter, createWebHistory } from 'vue-router'
import BookForm from '@/components/BookForm.vue'
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
import ListExecutive from '@/components/executive/ListOfBookExecutive.vue'
import SumBudget from '@/components/executive/SumBudget.vue'
import ShowBudget from '@/components/executive/ShowBudget.vue'
import SumShop from '@/components/admin/SumShop.vue'
import ManageBudget from '@/components/admin/ManageBudget.vue'
import ManageBudgetEdit from '@/components/admin/ManageBudgetEdit.vue'
import SumBudgetFaculty from '@/components/faculty/SumBudgetFaculty.vue'
import SumBudAdmin from '@/components/admin/SumBudgetAdmin.vue'
import ListAdmin from '@/components/admin/ListOfBookAdmin.vue'
import ShowBudFaculty from '@/components/faculty/ShowBudgetFaculty.vue'
import ManageBudFac from '@/components/faculty/ManageBudgetFaclty.vue'
import ManageBudEditFac from '@/components/faculty/ManageBudgetEditFaculty.vue'
import ManageBudPerFac from '@/components/faculty/ManageBudPerson.vue'
import ManageEditBudPer from '@/components/faculty/ManageBudEditPer.vue'
import ManageBudDe from '@/components/faculty/ManageBudDepartments.vue'
import ManageEditBudDe from '@/components/faculty/ManageBudEditDe.vue'
import BookFormShop from '@/components/shop/BookFormShop.vue'
import Dashboard from '@/components/shop/Dashboard.vue'
import Qr from '@/views/QRCode.vue'
// import LoginView2 from '@/views/LoginView2.vue'

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
      {
        path: 'dash-board',
        name: 'dashBoardShop',
        component: Dashboard,
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
      {
        path: 'sum-budget',
        name: 'sumBudFaculty',
        component: SumBudgetFaculty,
      },
      {
        path: 'sum-budget/:itemId',
        name: 'showBudFaculty',
        component: ShowBudFaculty,
      },
      {
        path: 'manage-budget',
        name: 'manageBudFaculty',
        component: ManageBudFac,
      },
      {
        path: 'manage-budget',
        name: 'manageBudFaculty',
        component: ManageBudFac,
      },
      {
        path: 'manage-budget',
        name: 'manageBudEditFaculty',
        component: ManageBudEditFac,
      },
      {
        path: 'manage-budget-person',
        name: 'manageBudPerFaculty',
        component: ManageBudPerFac,
      },
      {
        path: 'manage-edit-budget-person',
        name: 'manageEditBudPerFaculty',
        component: ManageEditBudPer,
      },
      {
        path: 'manage-budget-department',
        name: 'ManageBudDeFaculty',
        component: ManageBudDe,
      },
      {
        path: 'manage-edit-budget-department',
        name: 'ManageEditBudDeFaculty',
        component: ManageEditBudDe,
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
      {
        path: 'list-book-executive',
        name: 'listBookExecutive',
        component: ListExecutive,
      },
      {
        path: '/show-book/:itemId',
        name: 'showBookExecutive',
        component: ShowBook
      },
      {
        path: 'sum-budget',
        name: 'sumBudgetExecutive',
        component: SumBudget,
      },
      {
        path: '/show-budget/:itemId',
        name: 'showBudgetExecutive',
        component: ShowBudget
      },
      {
        path: 'show-shop',
        name: 'showShopExecutive',
        component: ShowShop,
      },
      {
        path: 'sum-shop',
        name: 'sumShopExecutive',
        component: SumShop,
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
      {
        path: 'purchase-budget',
        name: 'purchaseBudgetAdmin',
        component: PurchaseBudget,
      },
      {
        path: 'check-book',
        name: 'checkBookAdmin',
        component: CheckBook,
      },
      {
        path: 'sum-budget',
        name: 'sumBudgetAdmin',
        component: SumBudAdmin,
      },
      {
        path: '/show-budget/:itemId',
        name: 'showBudgetAdmin',
        component: ShowBudget
      },
      {
        path: 'manage-sell-book',
        name: 'ManageSellBookAdmin',
        component: ManageSellBook,
      },
      {
        path: 'list-book-presenters',
        name: 'listBookAdmin',
        component: ListAdmin,
      },
      {
        path: '/show-book/:itemId',
        name: 'showBookAdmin',
        component: ShowBook
      },
      {
        path: 'sum-book',
        name: 'sumBookAdmin',
        component: SumBook,
      },
      {
        path: 'add-shop',
        name: 'addShopAdmin',
        component: AddShop,
      },
      {
        path: 'show-shop',
        name: 'showShopAdmin',
        component: ShowShop,
      },
      {
        path: 'sum-shop',
        name: 'sumShopAdmin',
        component: SumShop,
      },
      {
        path: 'manage-budget',
        name: 'manageBudgetAdmin',
        component: ManageBudget,
      },
      {
        path: 'manage-budget-edit',
        name: 'manageBudgetEditAdmin',
        component: ManageBudgetEdit,
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
  {
    path: '/list-book-executive',
    name: 'listBook',
    component: ListExecutive,
  },
  {
    path: '/sum-budget',
    name: 'sumBudget',
    component: SumBudget,
  },
  {
    path: '/sum-shop',
    name: 'sumShop',
    component: SumShop,
  },
  {
    path: '/manage-budget',
    name: 'manageBudget',
    component: ManageBudget,
  },
  {
    path: '/sum-budget',
    name: 'sumBud',
    component: SumBudgetFaculty,
  },
  {
    path: '/book-form-shop',
    name: 'bookFormShop',
    component: BookFormShop,
  },
  {
    path: '/qr-code',
    name: 'qrCode',
    component: Qr,
  },
  {
    path: '/dash-board',
    name: 'dashBoard',
    component: Dashboard,
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
