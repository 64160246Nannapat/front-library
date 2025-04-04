<template>
  <v-container class="form-container" max-width="600px">
    <div
      class="form-title"
      style="
        background-color: #eed3d9;
        padding: 16px;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      "
    >
      เสนอการซื้อหนังสือ
    </div>
    <v-card-text>
      <div class="form-detail" v-if="user">
        <p>
          <strong>ชื่อ:</strong> {{ user.prefix }} {{ user.firstname }}
          {{ user.lastname }}
        </p>
        <p><strong>สถานะ:</strong> {{ user.role_offer }}</p>
        <p><strong>คณะ:</strong> {{ user.faculty_name }}</p>
        <p><strong>สาขา:</strong> {{ user.department_name }}</p>
        <p><strong>เบอร์:</strong> {{ user.tel }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>ยอดคงเหลือ:</strong> {{ user.e_coupon }} บาท</p>
      </div>

      <v-form ref="bookForm" v-model="valid" style="margin-top: 50px">
        <v-row dense>
          <v-col cols="12">
            <label for="store">ชื่อร้านค้า</label>
            <v-text-field
              v-model="store.store_name"
              :rules="[rules.required]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <label for="book">เลือกหนังสือ</label>
            <v-select
              v-model="selectedBook"
              :items="books"
              :item-title="bookLabel"
              item-value="book_id"
              label="ชื่อหนังสือ"
              return-object
              placeholder="-- เลือกหนังสือ --"
              @update:modelValue="onBookSelected"
            ></v-select>
          </v-col>

          <v-col cols="12">
            <label for="title">ชื่อหนังสือ<span class="required-asterisk">*</span></label>
            <v-text-field
              v-model="selectedBook.book_title"
              :rules="[rules.required]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label for="author">ชื่อผู้แต่ง</label>
            <v-text-field
              v-model="selectedBook.book_author"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label for="isbn">ISBN<span class="required-asterisk">*</span></label>
            <v-text-field
              v-model="selectedBook.ISBN"
              :rules="[rules.required]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label for="subject">รายวิชา<span class="required-asterisk">*</span></label>
            <v-text-field
              v-model="selectedBook.book_category"
              :rules="[rules.required]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label for="price">ราคาสุทธิ<span class="required-asterisk">*</span></label>
            <v-text-field
              v-model="selectedBook.book_price"
              :rules="[rules.required, rules.number]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12" class="mb-1">
            <label for="store">รายละเอียด</label>
            <v-textarea
              v-model="selectedBook.book_description"
              variant="outlined"
              dense
              :style="{ width: '100%', minHeight: '100px' }"
              rows="4"
            ></v-textarea>
          </v-col>

          <v-col cols="12">
            <label for="file">ไฟล์<span class="optional"> (optional)</span></label>

            <v-btn
              @click="triggerFileInput"
              style="
                background-color: #ede8dc;
                border: 1px solid black;
                width: 100%;
                margin-top: 8px;
              "
            >
              <v-icon left>mdi-tray-arrow-up</v-icon> เลือกรูปภาพ
            </v-btn>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              style="display: none"
              @change="handleFileChange"
            />

            <!-- ✅ แสดงรายการไฟล์ที่เลือก -->
            <v-row v-if="selectedFiles.length" class="mt-2">
              <v-col v-for="(file, index) in selectedFiles" :key="index" cols="12" md="6">
                <v-card outlined class="d-flex align-center pa-2">
                  <v-icon class="mr-2">mdi-file-image</v-icon>
                  <span class="truncate-text">{{ file.name }}</span>
                  <v-spacer></v-spacer>
                  <v-btn icon small color="red" @click="removeFile(index)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-btn
      style="
        background-color: #eed3d9;
        font-size: 16px;
        font-weight: bold;
        margin-top: 50px;
        width: auto; /* เปลี่ยนเป็น auto เพื่อให้ความยาวตามเนื้อหาภายใน */
        padding: 10px 20px; /* ปรับขนาดให้เหมาะสม */
      "
      block
      large
      @click="submitForm"
      >ยืนยัน</v-btn
    >
    <!-- dialog ยืนยันการส่งข้อมูล-->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="dialog" style="background-color: #ede8dc">
        <v-card-title
          class="text-start"
          style="
            font-weight: bold;
            background-color: #c39898;
            padding: 16px;
            border-top-left-radius: 0px;
            border-top-right-radius: 0px;
            border-bottom-left-radius: 16px;
            border-bottom-right-radius: 16px;
            font-size: 20px;
          "
        >
          {{ isDuplicate ? 'แจ้งเตือน' : 'ยืนยันการส่งแบบฟอร์ม' }}
        </v-card-title>

        <v-card-text class="text-start" style="font-size: 14px; color: #808080">
          <!-- แสดงรายละเอียดหนังสือ -->
          <div>
            <div>ชื่อ: {{ book.FirstName }} {{ book.LastName }}</div>
            <div>ตำแหน่ง: {{ book.Role }}</div>
            <div>คณะ: {{ book.Faculty }}</div>
            <div>ชื่อหนังสือ: {{ book.Title }}</div>
            <div>ชื่อผู้แต่ง: {{ book.Author }}</div>
            <div>ISBN: {{ book.isbn }}</div>
            <div>รายวิชา: {{ book.Course || 'ไม่ระบุ' }}</div>
            <div>จำนวน: {{ book.Count }} เล่ม</div>
            <div>รายละเอียด: {{ book.Details || 'ไม่มีรายละเอียด' }}</div>
          </div>
          <v-divider v-if="isDuplicate" class="my-4" style="color: black"></v-divider>
          <!-- แสดงข้อความแจ้งเตือนหากพบ ISBN ซ้ำ -->
          <div v-if="isDuplicate" style="color: red; font-weight: bold; margin-top: 16px">
            {{ confirmMessage }}
          </div>
        </v-card-text>

        <v-card-actions justify="start">
          <v-btn
            color="black"
            @click="cancelForm"
            style="
              font-weight: bold;
              border: 2px;
              border-radius: 8px;
              background-color: #fa8072;
              margin-bottom: 8px;
            "
          >
            ยกเลิก
          </v-btn>

          <!-- ปุ่มยืนยันที่จะส่งฟอร์ม -->
          <v-btn
            color="black"
            @click="confirmForm"
            style="
              font-weight: bold;
              border: 2px;
              border-radius: 8px;
              background-color: #58d68d;
              margin-bottom: 8px;
            "
          >
            ยืนยัน
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog ยืนยันการส่งข้อมูลสำเร็จ-->
    <v-dialog
      v-model="successdialog"
      max-width="300px"
      persistent
      center
      @click:outside="successdialog = false"
    >
      <v-card class="dialog" style="background-color: #ede8dc; border-radius: 50px">
        <v-card-text
          class="text-center"
          style="font-size: 24px; font-weight: bold; color: #808080; padding: 20px"
        >
          <img
            src="@/assets/check.png"
            alt="Check"
            style="width: 80px; height: 80px; margin-bottom: 20px"
          />

          <!-- แสดงข้อความยืนยัน -->
          <div>เสนอข้อมูลหนังสือสำเร็จ</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, toRaw } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useRoute } from 'vue-router'
import LZString from 'lz-string'
import axios from 'axios'

const userInfo = ref<any>(null)
const route = useRoute()
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const valid = ref(false)
const bookForm = ref(null)
const decodedUserInfo = ref<any>(null)
const disableValidation = ref(false)
const submitted = ref(false)
const dialog = ref(false)
const successdialog = ref(false)
const isDuplicate = ref(false)
const confirmMessage = ref('')
const selectedFiles = ref([])

const book = ref({
  User: '',
  Faculty: '',
  Department: '',
  Store: '',
  Book: null,
  // Title: '',
  // Author: '',
  // Year: '',
  // isbn: '',
  // Course: '',
  // Details: '',
  imgs: [],
})

interface User {
  user_id: number
  prefix: string
  firstname: string
  lastname: string
  role_offer: string
  faculty_id: number
  faculty_name: string
  department_id: number
  department_name: string
  tel: string
  email: string
  e_coupon: number
}

const user = ref<User | null>(null)

const store = ref({
  store_id: '',
  store_name: '',
})

const books = ref([
  {
    book_id: '',
    ISBN: '',
    book_title: '',
    book_author: '',
    book_price: '',
    book_category: '',
    book_published: '',
    book_volumn: '',
    book_description: '',
    book_status: '',
  },
])

const selectedBook = ref({
  book_id: '',
  ISBN: '',
  book_title: '',
  book_author: '',
  book_price: '',
  book_category: '',
  book_published: '',
  book_volumn: '',
  book_description: '',
  book_status: '',
})

const fetchStoreData = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    console.error('❌ ไม่พบ Token กรุณาเข้าสู่ระบบใหม่')
    alert('❌ ไม่พบ Token กรุณาเข้าสู่ระบบใหม่')
    window.location.href = '/'
    return
  }

  try {
    const decoded: any = isTokenExpired(token) ? await refreshAndDecodeToken() : jwtDecode(token)
    console.log('🔍 Token Decoded:', decoded)

    if (!decoded || decoded.role !== 'Store' || !decoded.store) {
      console.warn('⚠️ ไม่พบข้อมูลร้านค้า หรือคุณไม่มีสิทธิ์เข้าถึง')
      return
    }

    // 📌 บันทึกค่า store
    store.value = {
      store_name: decoded.store.store_name || '',
      store_id: decoded.store.store_id || null,
    }

    // ✅ เก็บค่า store_id ลงใน book
    book.value.Store = decoded.store.store_id || ''

    console.log('🏪 Store Data:', store.value)
    console.log('📌 บันทึก Store ID ลงใน book:', book.value.Store)

    if (store.value.store_id) {
      await fetchBooksFromAPI(store.value.store_id)
    }
  } catch (error) {
    console.error('❌ Token decoding error:', error)
  }
}

const fetchBooksFromAPI = async (storeId) => {
  try {
    const response = await fetch(`http://bookfair.buu.in.th:8043/stores/${storeId}`)
    const data = await response.json()

    if (data.books) {
      // เก็บข้อมูลหนังสือทั้งหมดลงในตัวแปร books
      books.value = data.books.map((book) => ({
        book_id: book.book_id,
        ISBN: book.ISBN || '',
        book_title: book.book_title || '',
        book_author: book.book_author || '',
        book_price: book.book_price || '',
        book_category: book.book_category || '',
        book_published: book.book_published || '',
        book_volumn: book.book_volumn || '',
        book_description: book.book_description || '',
        book_status: book.book_status || '',
      }))
      console.log('📚 Books Data:', books.value)
    } else {
      console.warn('⚠️ ไม่พบข้อมูลหนังสือ')
      books.value = [] // กรณีไม่มีข้อมูลหนังสือ
    }
  } catch (error) {
    console.error('❌ Error fetching books:', error)
  }
}

const rules = {
  required: (value: string | null) => value !== null && value !== '',
  number: (value: string | null) => {
    if (value === null || value === undefined || value === '') {
      return true
    }
    return /^[0-9]+(\.[0-9]+)?$/.test(value) || 'ต้องเป็นตัวเลขเท่านั้น'
  },
}

const submitForm = async (bookForm) => {
  try {
    if (!book.value.Book) {
      alert('กรุณาเลือกหนังสือก่อนทำการยืนยัน')
      return
    }

    const formData = new FormData()

    // ✅ เพิ่มข้อมูลที่ไม่ใช่ไฟล์
    formData.append('book', book.value.Book)
    formData.append('user', book.value.User)
    formData.append('faculty', book.value.Faculty)
    formData.append('department', book.value.Department)
    formData.append('store', book.value.Store)

    // ✅ ตรวจสอบไฟล์และเพิ่มเข้าไปใน FormData
    if (book.value.imgs && book.value.imgs.length > 0) {
      book.value.imgs.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`imgs`, file) // ✅ ใช้ชื่อ `imgs` เหมือน Backend
        } else {
          console.warn(`⚠️ ไฟล์ที่ ${index} ไม่ใช่ File`, file)
        }
      })
    } else {
      console.warn('⚠️ ไม่มีรูปภาพถูกเพิ่มเข้าไป')
    }

    console.log('📤 ส่งข้อมูลไปยัง API:', formData)

    // ✅ ตั้งค่า Headers เป็น `multipart/form-data`
    const response = await axios.post('http://bookfair.buu.in.th:8043/offer-forms-ofl', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    console.log('✅ Response จาก API:', response.data)
    successdialog.value = true // ✅ แสดง dialog ยืนยันการส่งข้อมูลสำเร็จ

    // ✅ รีโหลดหน้าเว็บเพื่อเคลียร์ทุกอย่าง
    setTimeout(() => {
      window.location.href = window.location.href // รีโหลดเหมือน F5
    }, 1000) // รอ 3 วินาที
  } catch (error) {
    console.error('❌ Error submitting form:', error)
    if (error.response) {
      console.error('🚨 API Error Details:', error.response.data)
    }
  }
}

// const submitForm = async () => {
//   const form = bookForm.value;
//   if (form && typeof form.validate === 'function') {
//     const { valid } = await form.validate();

//     if (valid) {
//       if (!book.value.Count) {
//         book.value.Count = 1;
//       }

//       const duplicate = await checkDuplicateISBN(selectedBook.value.ISBN);
//       isDuplicate.value = duplicate;

//       confirmMessage.value = duplicate
//         ? `"${selectedBook.value.book_title}" เคยมีการเสนอแล้ว ต้องการเสนอซ้ำหรือไม่?`
//         : 'ยืนยันการส่งแบบฟอร์ม';

//       dialog.value = true;
//     } else {
//       console.log('Validation Failed');
//     }
//   } else {
//     console.error('Form reference is invalid or validate is not a function');
//   }
// };

const resetForm = (bookForm) => {
  selectedBook.value = {
    book_id: null,
    ISBN: '',
    book_title: '',
    book_author: '',
    book_price: '',
    book_category: '',
    book_published: '',
    book_volumn: '',
    book_description: '',
    book_status: '',
  }

  books.value = [...books.value]
  bookForm.resetValidation()
  submitted.value = false

  // ✅ รีเซ็ตไฟล์ที่เลือก
  selectedFiles.value = []
  book.value.imgs = []
}

const checkDuplicateISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://bookfair.buu.in.th:8043/offer-forms-ofl?isbn=${isbn}`)
    console.log('API Response:', response.data)

    // ตรวจสอบว่า response.data เป็น array และไม่ว่าง
    if (Array.isArray(response.data) && response.data.length > 0) {
      // ตรวจสอบว่ามีข้อมูล ISBN ที่ตรงกันหรือไม่
      for (let offer of response.data) {
        if (offer.ISBN === isbn) {
          return true // ISBN ซ้ำ
        }
      }
    }

    return false // ไม่มี ISBN ซ้ำ
  } catch (error) {
    console.error('Error checking duplicate ISBN:', error)
    return false // หากเกิดข้อผิดพลาดให้ถือว่าไม่มี ISBN ซ้ำ
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files] // ✅ รองรับหลายไฟล์
  book.value.imgs = [...book.value.imgs, ...files] // ✅ เก็บไปที่ book.value.imgs
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
  book.value.imgs.splice(index, 1)
}

const isTokenExpired = (token: string) => {
  const decoded: any = jwtDecode(token)
  const currentTime = Date.now() / 1000 // Convert to seconds
  return decoded.exp < currentTime // Compare expiration time
}

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (refreshToken) {
    try {
      const response = await axios.post('http://bookfair.buu.in.th:8044/auth/refresh', {
        refreshToken,
      })
      const { access_token, refresh_token } = response.data
      // เก็บ Access Token และ Refresh Token ใหม่
      localStorage.setItem('token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      return access_token // คืนค่าใหม่ของ access_token
    } catch (error) {
      console.error('ไม่สามารถรีเฟรช token ได้:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/mobile'
    }
  } else {
    alert('ไม่พบ Refresh Token')
    window.location.href = '/mobile'
  }
}

const refreshAndDecodeToken = async () => {
  try {
    const newAccessToken = await refreshToken()
    return jwtDecode(newAccessToken)
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

const onBookSelected = (selected) => {
  if (!book.value) {
    console.error('❌ book.value is undefined')
    return
  }

  const rawBook = toRaw(selected) // แปลง Proxy เป็น object ปกติ
  console.log('📖 เลือกหนังสือ:', rawBook)

  // เซ็ตค่า book_id ใน book.value.Book
  book.value.Book = rawBook.book_id

  console.log('📝 อัปเดต book:', book.value)
}

const bookLabel = (book) => {
  if (!book || typeof book !== 'object' || !book.book_title) {
    return '-- เลือกหนังสือ --'
  }
  return `${book.book_title}, ${book.book_author} ราคา ${book.book_price} บาท (${book.book_volumn})`
}

onMounted(async () => {
  try {
    const route = useRoute()

    const rawData = route.query.data
    console.log('BookFormShop.vue:269 route.query:', rawData)

    if (!rawData || rawData === 'null') {
      console.warn('❌ ไม่มีข้อมูลที่ถูกต้องจาก QR Code')
      return
    }

    // เรียกใช้ fetchStoreData() ก่อนเพื่อดึงข้อมูลร้านค้า
    await fetchStoreData()

    const decodedString = LZString.decompressFromEncodedURIComponent(rawData as string)
    console.log('🔍 Decoded String:', decodedString)

    if (decodedString) {
      const decodedUserInfo = JSON.parse(decodedString)

      // ✅ บันทึกข้อมูล QR Code ลงในตัวแปร user
      user.value = {
        user_id: decodedUserInfo.user_id,
        prefix: decodedUserInfo.prefix,
        firstname: decodedUserInfo.firstname,
        lastname: decodedUserInfo.lastname,
        role_offer: decodedUserInfo.role_offer,
        faculty_id: decodedUserInfo.faculty_id,
        faculty_name: decodedUserInfo.faculty_name,
        department_id: decodedUserInfo.department_id,
        department_name: decodedUserInfo.department_name,
        tel: decodedUserInfo.tel,
        email: decodedUserInfo.email,
        e_coupon: decodedUserInfo.e_coupon,
      }

      console.log('✅ ข้อมูลจาก QR Code:', user.value)

      // ✅ บันทึก user_id ลงใน book.value.User
      book.value.User = String(user.value.user_id)
      book.value.Faculty = String(user.value.faculty_id)
      book.value.Department = String(user.value.department_id)

      console.log('📖 อัปเดต book:', book.value)
    } else {
      console.error('❌ ข้อมูลที่ถอดรหัสมาเป็นค่าว่าง')
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการแปลงข้อมูล QR Code:', error)
  }
})

watch(selectedBook, (newVal) => {
  console.log('🔍 selectedBook updated:', newVal)
})
</script>

<style scoped>
.form-container {
  background-color: #fdf3f3;
  padding: 20px;
  border-radius: 12px;
}

.form-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.form-detail p {
  margin: 5px 0;
  font-size: 14px;
}

.required-asterisk {
  color: red;
}

.optional {
  color: rgb(64, 64, 64);
  font-size: smaller;
}

.text-center {
  text-align: center;
}
</style>
