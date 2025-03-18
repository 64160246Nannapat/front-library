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
              item-value="ISBN"
              label="ชื่อหนังสือ"
              return-object
              placeholder="-- เลือกหนังสือ --"
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
              class="text-center"
            >
              <v-icon left style="margin-right: 10px">mdi-tray-arrow-up</v-icon>
              เลือกรูปภาพหน้าปกและปกใน
            </v-btn>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileChange"
            />
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
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const book = ref({
  prefix: '',
  firstname: '',
  lastname: '',
  role_offer: '',
  faculty_name: '',
  department_name: '',
  tel: '',
  email: '',
  e_coupon: '',
  Title: '',
  Author: '',
  Year: '',
  isbn: '',
  Course: '',
  User: '',
  Details: '',
})

interface User {
  prefix: string
  firstname: string
  lastname: string
  role_offer: string
  faculty_name: string
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
  ISBN: '',
  book_title: '',
  book_author: '',
  book_price: '',
  book_category: '',
  book_published: '',
  book_volumn: '',
  book_description: '',
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
    // 🛠 ตรวจสอบว่า Token หมดอายุหรือไม่
    const decoded: any = isTokenExpired(token) ? await refreshAndDecodeToken() : jwtDecode(token)

    console.log('🔍 Token Decoded:', decoded)

    if (!decoded || decoded.role !== 'Store' || !decoded.store) {
      console.warn('⚠️ ไม่พบข้อมูลร้านค้า หรือคุณไม่มีสิทธิ์เข้าถึง')
      return
    }

    // 📌 เซ็ตข้อมูลร้านค้า
    store.value = {
      store_name: decoded.store.store_name || '',
      store_id: decoded.store.store_id || null,
    }

    console.log('🏪 Store Data:', store.value)

    // 📌 ถ้ามี store_id ให้ดึงข้อมูลหนังสือจาก API
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
  required: (value: string) => !!value || 'กรุณากรอกข้อมูล',
  number: (value: string | null) => {
    if (value === null || value === undefined || value === '') {
      return true
    }
    return /^[0-9]+(\.[0-9]+)?$/.test(value) || 'ต้องเป็นตัวเลขเท่านั้น'
  },
}

const submitForm = () => {
  if (bookForm.value?.validate()) {
    console.log('Form submitted:', book.value)
    bookForm.value.reset()
  } else {
    console.log('Form validation failed')
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0]
    console.log('เลือกไฟล์:', uploadedFile.value.name)
  }
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

const bookLabel = (book) => {
  if (!book || !book.book_title) return '-- เลือกหนังสือ --'
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
      // กำหนดข้อมูลจาก decodedUserInfo ไปที่ user.value
      user.value = decodedUserInfo
      console.log('✅ ข้อมูลจาก QR Code:', user.value)
    } else {
      console.error('❌ ข้อมูลที่ถอดรหัสมาเป็นค่าว่าง')
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการแปลงข้อมูล QR Code:', error)
  }
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
