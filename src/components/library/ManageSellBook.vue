<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/bookLibrary.png" alt="Library Image" />
        <h1>จัดการเสนอซื้อหนังสือ</h1>

        <v-row align="center" class="date-status-row" justify="end">
          <v-col cols="auto">
            <v-menu
              v-model="menuDate"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, props }">
                <v-text-field
                  v-bind="props"
                  v-on="on"
                  v-model="formattedDate"
                  placeholder="dd/mm/yyyy"
                  class="custom-date-picker"
                  hide-details
                  rounded="lg"
                  readonly
                  flat
                  solo
                  prepend-inner-icon="$calendar"
                  suffix-icon="mdi-calendar"
                  variant="outlined"
                />
              </template>

              <v-date-picker v-model="selectedDate" locale="th" @input="onSearch" />
            </v-menu>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <v-col cols="auto">
          <div class="formatted-date-display">
            <h2>{{ fullFormattedDate }}</h2>
          </div>
        </v-col>
      </v-row>

      <!-- Search Filters Section -->
      <v-row align="center">
        <!-- <v-col cols="auto">
          <v-select
            :items="['ISBN', 'TITLE', 'AUTHOR']"
            v-model="searchCategory"
            class="select-isbn"
            variant="outlined"
            rounded="lg"
          ></v-select>
        </v-col>

        <v-col cols="auto">
          <v-text-field
            v-model="searchText"
            variant="outlined"
            class="serch-text"
            rounded="lg"
            @input="onSearch"
          ></v-text-field>
        </v-col>

        <v-col cols="auto" style="margin-top: -24px">
          <v-btn
            color="#EED3D9"
            @click="onSearch"
            class="custom-isbn"
            style="height: 40px"
            rounded="lg"
          >
            <v-icon size="20">mdi-magnify</v-icon>
          </v-btn>
        </v-col> -->

        <v-tabs v-model="selectedTab" class="mb-4">
          <v-tab value="กำลังดำเนินการ" :class="{ 'active-tab': selectedTab === 'กำลังดำเนินการ' }">
            กำลังดำเนินการ
          </v-tab>
          <v-tab
            value="ไม่อนุมัติการซื้อ"
            :class="{ 'active-tab': selectedTab === 'ไม่อนุมัติการซื้อ' }"
          >
            ไม่อนุมัติการซื้อ
          </v-tab>
          <v-tab value="อนุมัติการซื้อ" :class="{ 'active-tab': selectedTab === 'อนุมัติการซื้อ' }">
            อนุมัติการซื้อ
          </v-tab>
        </v-tabs>

        <v-col cols="12" md="6" lg="4" class="ml-auto d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">ประเภท:</h3>
          <v-select
            :items="['เสนอหนังสือออนไลน์', 'เสนอหนังสืองานหนังสือ']"
            v-model="searchBook"
            class="select-book"
            variant="outlined"
            rounded="lg"
            @update:modelValue="onSearch"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Data Table Section -->
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="filteredItems"
        :items-length="totalItems"
        :loading="loading"
        @update:options="loadItems"
        show-items-per-page="false"
        :hide-default-footer="true"
        style="width: 100%; table-layout: auto; border-collapse: collapse"
        class="custom-table no-scrollbar"
      >
        <template #item.rowIndex="{ item }">
          {{ item.rowIndex }}
        </template>

        <template #item.form_status="{ item }">
          {{ item.form_status }}
        </template>

        <template #item.image="{ item }">
          <template v-if="item.book_category === 'เสนอหนังสืองานหนังสือ'">
            <v-btn
              icon
              color="#FCDC94"
              @click="viewImage(item)"
              style="
                border-radius: 8px;
                width: 70px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-dialog v-model="dialog" max-width="400">
              <template #default>
                <p
                  v-if="typeof selectedBookImage === 'string'"
                  style="text-align: center; padding: 16px; font-size: 16px"
                >
                  {{ selectedBookImage }}
                </p>

                <img
                  v-else
                  :src="selectedBookImage"
                  alt="Book Image"
                  style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 8px"
                />
              </template>
            </v-dialog>
          </template>
        </template>

        <template #item.check="{ item }">
          <div class="d-flex">
            <v-btn
              color="primary"
              :disabled="!item.ISBN || !item.ISBN.length"
              @click="fetchBooks(item.ISBN)"
            >
              <v-icon left style="margin-right: 5px">mdi-magnify</v-icon>ตรวจสอบ
            </v-btn>
          </div>
        </template>

        <template #item.view="{ item }">
          <div class="d-flex">
            <v-btn color="primary" :disabled="!item.offer_form_id" @click="onMessageClick(item)">
              <v-icon left style="margin-right: 5px">mdi-email-outline</v-icon>ดำเนินการ
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <v-dialog v-model="dialogSuccess" width="90%" max-width="1530px">
        <v-card>
          <v-card-title>ข้อมูลหนังสือ</v-card-title>
          <v-tabs v-model="activeTab">
            <v-tab value="duplicate">ตรวจหนังสือซ้ำ</v-tab>
            <v-tab value="compare">เปรียบเทียบราคา</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="activeTab">
              <!-- Tab: ตรวจหนังสือซ้ำ -->
              <v-window-item value="duplicate">
                <div class="dialog-container">
                  <v-simple-table class="custom-table">
                    <thead>
                      <tr>
                        <th v-for="header in DialogHeaders" :key="header.value">
                          {{ header.text }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(book, index) in booksData"
                        :key="index"
                        :class="{
                          'duplicate-row':
                            selectedISBN &&
                            book.ISBN.replace(/\s*\(ล\.\s*\d+\)$/, '') ===
                              selectedISBN.replace(/\s*\(ล\.\s*\d+\)$/, ''),
                        }"
                      >
                        <td>
                          {{ book.ISBN }}
                          <span
                            v-if="
                              book.ISBN.replace(/\s*\(ล\.\s*\d+\)$/, '') ===
                              selectedISBN.replace(/\s*\(ล\.\s*\d+\)$/, '')
                            "
                            class="duplicate-text"
                          >
                            *ซ้ำ
                          </span>
                        </td>
                        <td>{{ book.book_title }}</td>
                        <td>{{ book.book_author }}</td>
                        <td>{{ book.description }}</td>
                        <td>{{ book.publisher }}</td>
                        <td>{{ book.edition }}</td>
                        <td>{{ book.detail }}</td>
                        <td class="d-flex justify-center">
                          <v-btn @click.stop="openImageDialog(book.bookCover)">
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </div>
              </v-window-item>

              <!-- Tab: เปรียบเทียบราคา -->
              <v-window-item value="compare">
                <div class="dialog-container">
                  <v-simple-table class="custom-table">
                    <thead>
                      <tr>
                        <th v-for="header in compareHeaders" :key="header.key">
                          {{ header.title }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(form, index) in filteredOfferForms"
                        :key="index"
                        :class="{
                          'duplicate-row':
                            selectedISBN &&
                            selectedCreatedAt &&
                            selectedPrice &&
                            form.ISBN.replace(/\s*\(ล\.\s*\d+\)$/, '') ===
                              selectedISBN.replace(/\s*\(ล\.\s*\d+\)$/, '') &&
                            formatDateTime(form.createdAt) === selectedCreatedAt &&
                            form.book_price === selectedPrice,
                        }"
                      >
                        <td>{{ formatDateTime(form.createdAt) }}</td>
                        <td>{{ form.user_fullname }}</td>
                        <td>{{ form.store_name }}</td>
                        <td>{{ form.ISBN }}</td>
                        <td>{{ form.book_title }}</td>
                        <td>{{ form.book_author }}</td>
                        <td>{{ form.book_price }}</td>
                        <td>{{ form.book_quantity }}</td>
                        <td>{{ (form.book_price * form.book_quantity).toFixed(2) }} บาท</td>
                        <td>{{ form.form_status }}</td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>

          <v-card-actions>
            <v-btn text @click="dialogSuccess = false">ปิด</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogImage" max-width="500px">
        <v-card>
          <v-card-title>ปกหนังสือ</v-card-title>
          <v-card-text class="text-center">
            <v-img :src="selectedImage" width="100%" max-width="500px"></v-img>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="dialogImage = false">ปิด</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Image Viewer Dialog -->
      <v-dialog v-model="dialog" max-width="600">
        <v-card style="background-color: #e5e1da; border-radius: 16px">
          <v-card-actions style="background-color: #cecbcb">
            <v-btn text @click="dialog = false" style="font-size: 20px; font-weight: bold">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </v-card-actions>

          <v-spacer></v-spacer>

          <!-- เพิ่มเงื่อนไขตรงนี้ -->
          <template v-if="selectedBookImage === 'ไม่มีรูปภาพ'">
            <p
              style="
                text-align: center;
                padding: 16px;
                font-size: 20px;
                color: black;
                margin-top: 20px;
              "
            >
              {{ selectedBookImage }}
            </p>
          </template>
          <v-img
            v-else
            :src="selectedBookImage"
            max-height="600"
            contain
            @click="toggleImage"
            style="padding: 16px; margin-top: 10px; margin-bottom: 20px"
          ></v-img>
        </v-card>
      </v-dialog>

      <!-- Confirmation Dialog -->
      <v-dialog v-model="confirmDialog" max-width="500">
        <v-card>
          <v-card-title>ยืนยันการดำเนินการ</v-card-title>
          <v-card-text> คุณต้องการอนุมัติการซื้อสำหรับรายการนี้หรือไม่? </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="rejectPurchase">ไม่อนุมัติการซื้อ</v-btn>
            <v-btn color="green" text @click="approvePurchase">อนุมัติการซื้อ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Message Dialog -->
      <v-dialog v-model="messageDialog" max-width="800">
        <v-card style="background-color: #ede8dc">
          <!-- Header with rounded corners -->
          <div
            style="
              background-color: #eed3d9;
              padding: 16px;
              border-top-left-radius: 0px; /* ไม่มีความมนที่มุมบนซ้าย */
              border-top-right-radius: 0px; /* ไม่มีความมนที่มุมบนขวา */
              border-bottom-left-radius: 16px; /* ความมนที่มุมล่างซ้าย */
              border-bottom-right-radius: 16px; /* ความมนที่มุมล่างขวา */
            "
          >
            <v-card-title>ส่ง: {{ selectedItem?.user_fullname || 'ไม่ระบุ' }}</v-card-title>
            <v-card-subtitle
              >E-mail: {{ selectedItem?.user_email || 'ไม่มีข้อมูล' }}</v-card-subtitle
            >
            <v-card-subtitle>วันที่: {{ fullDate }}</v-card-subtitle>
            <v-card-subtitle>เวลา: {{ fullTime }}</v-card-subtitle>
          </div>

          <v-card-text>
            <v-textarea
              style="margin-top: 8px; border: 1px solid #ddd"
              v-model="message"
              label="ข้อความ"
              rows="8"
            />
          </v-card-text>

          <v-card-actions style="margin-bottom: 10px; margin-right: 12px">
            <v-spacer />
            <!-- Button with border -->
            <v-btn
              color="black"
              text
              outlined
              style="
                background-color: #fa8072;
                border: 2px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: bold;
                width: 100px;
                height: 40px;
              "
              @click="messageDialog = false"
            >
              ยกเลิก
            </v-btn>
            <v-btn
              color="black"
              text
              outlined
              style="
                background-color: #58d68d;
                border: 2px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: bold;
                width: 100px;
                height: 40px;
              "
              @click="sendMessage"
            >
              ส่งข้อความ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import defaultImage from '@/assets/front-book.png'
import backImage from '@/assets/back-book.png'
import axios from 'axios'

// Date & Search Variables
const selectedDate = ref(new Date())
const menuDate = ref(false)
const dialogSuccess = ref(false)
const searchBook = ref('เสนอหนังสือออนไลน์')
const selectedTab = ref('กำลังดำเนินการ')
const loading = ref(false)
const dialog = ref(false)
const selectedBookImage = ref('ไม่มีรูปภาพ')
const totalItems = ref(0)
const serverItems = ref<BookItem[]>([])
const fullDate = ref('')
const fullTime = ref('')
const itemsPerPage = ref(1000000)
const noDataMessage = ref('')
const booksData = ref([])
const selectedISBN = ref('')
const selectedCreatedAt = ref('')
const selectedPrice = ref(0)
const dialogImage = ref(false)
const selectedImage = ref('')
const messageDialog = ref(false)
const confirmDialog = ref(false)
const selectedItem = ref(null)
const message = ref('')
const activeTab = ref('duplicate')
const offerForms = ref([])

interface BookItem {
  offer_form_id: number
  user_email: string
  user_fullname: string
  book_title: string
  book_author: string
  ISBN: string
  book_price: number
  book_quantity: number
  book_imgs: string
  form_status: string
  book_category: string
  publisher: string
  edition: string
  description: string
  bookCover: string
  detail: string
}

// Header สำหรับ 'เสนอหนังสือออนไลน์'
const NoImageHeaders = [
  { title: 'ลำดับ', key: 'rowIndex', align: 'start' },
  { title: 'ข้อมูลผู้คัดเลือก', key: 'user_fullname' },
  { title: 'ร้านค้า', key: 'store.store_name' },
  { title: 'ชื่อหนังสือ', key: 'book_title' },
  { title: 'ผู้แต่ง', key: 'book_author' },
  { title: 'ปีพิมพ์', key: 'published_year' },
  { title: 'ISBN', key: 'ISBN' },
  { title: 'ราคาสุทธิ', key: 'book_price' },
  { title: 'จำนวน', key: 'book_quantity' },
  { title: 'ตรวจหนังสือ', key: 'check' },
  { title: 'ดำเนินการ', key: 'view' },
]

// Header สำหรับ 'เสนอหนังสืองานหนังสือ'
const ImageHeaders = [
  { title: 'ลำดับ', key: 'rowIndex', align: 'start' },
  { title: 'ข้อมูลผู้คัดเลือก', key: 'user_fullname' },
  { title: 'ร้านค้า', key: 'store.store_name' },
  { title: 'ชื่อหนังสือ', key: 'book_title' },
  { title: 'ผู้แต่ง', key: 'book_author' },
  { title: 'ปีพิมพ์', key: 'published_year' },
  { title: 'ISBN', key: 'ISBN' },
  { title: 'ราคาสุทธิ', key: 'book_price' },
  { title: 'จำนวน', key: 'book_quantity' },
  { title: 'รูปภาพ', key: 'image', align: 'center' },
  { title: 'ตรวจหนังสือ', key: 'check' },
  { title: 'ดำเนินการ', key: 'view' },
]

const DialogHeaders = [
  { text: 'ISBN', align: 'start', key: 'ISBN', value: 'ISBN' },
  { text: 'ชื่อหนังสือ', value: 'book_title' },
  { text: 'ผู้เขียน', value: 'book_author' },
  { text: 'ประเภท', value: 'description' },
  { text: 'สำนักพิมพ์', value: 'publisher' },
  { text: 'ฉบับ', value: 'edition' },
  { text: 'รายละเอียด', value: 'detail' },
  { text: 'ปกหนังสือ', value: 'bookCover' },
]

const compareHeaders = ref([
  { title: 'วันที่เสนอ', key: 'createdAt' },
  { title: 'ชื่อผู้เสนอ', key: 'user_fullname' },
  { title: 'ชื่อร้านค้า', key: 'store_name' },
  { title: 'ISBN', key: 'ISBN' },
  { title: 'ชื่อหนังสือ', key: 'book_title' },
  { title: 'ผู้เขียน', key: 'book_author' },
  { title: 'ราคา', key: 'book_price' },
  { title: 'จำนวน', key: 'book_quantity' },
  { title: 'ราคารวม', key: 'total_price' },
  { title: 'สถานะ', key: 'form_status' },
])

// คำนวณ headers ตามค่า searchBook
const headers = computed(() => {
  const baseHeaders = searchBook.value === 'เสนอหนังสือออนไลน์' ? NoImageHeaders : ImageHeaders

  if (selectedTab.value === 'ไม่อนุมัติการซื้อ' || selectedTab.value === 'อนุมัติการซื้อ') {
    return baseHeaders.map((header) =>
      header.key === 'view' ? { ...header, title: 'สถานะ', key: 'form_status' } : header,
    )
  }

  return baseHeaders
})

const filteredItems = computed(() => {
  return serverItems.value
    .filter((item) => item.book_category === searchBook.value)
    .filter((item) => item.form_status === selectedTab.value)
    .map((item, index) => ({ ...item, rowIndex: index + 1 }))
})

// ฟอร์แมตวันที่
const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear() + 543
  return `${day}/${month}/${year}`
})

const fullFormattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value)

  const days = [
    'วันอาทิตย์',
    'วันจันทร์',
    'วันอังคาร',
    'วันพุธ',
    'วันพฤหัสบดี',
    'วันศุกร์',
    'วันเสาร์',
  ]
  const months = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ]

  const dayName = days[date.getDay()]
  const day = date.getDate()
  const monthName = months[date.getMonth()]
  const year = date.getFullYear() + 543

  return `${dayName} ที่ ${day} ${monthName} พ.ศ. ${year}`
})

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return (
    date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ` เวลา ${date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`
  )
}

const filterDataByDate = (data: any[], selectedDate: Date) => {
  const startOfDay = new Date(selectedDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(selectedDate)
  endOfDay.setHours(23, 59, 59, 999)

  return data
    .filter((item) => {
      // ตรวจสอบว่าเป็นแท็บที่เลือก 'ไม่อนุมัติการซื้อ' หรือ 'อนุมัติการซื้อ'
      const dateToCompare =
        (selectedTab.value === 'ไม่อนุมัติการซื้อ' || selectedTab.value === 'อนุมัติการซื้อ')
          ? new Date(item.updatedAt) // ถ้าเป็นให้ใช้ updatedAt
          : new Date(item.createdAt) // ถ้าไม่ใช่ให้ใช้ createdAt

      return dateToCompare >= startOfDay && dateToCompare <= endOfDay
    })
    .map((item, index) => ({
      ...item,
      rowIndex: index + 1, // เพิ่มลำดับแถว
    }))
}

const filteredOfferForms = computed(() => {
  console.log('selectedISBN:', selectedISBN.value)
  console.log('selectedCreatedAt:', selectedCreatedAt.value)
  console.log('selectedPrice:', selectedPrice.value)

  return offerForms.value.filter((form) => {
    console.log('Checking:', form.ISBN, formatDateTime(form.createdAt), form.book_price)

    const matchesISBN = selectedISBN.value ? form.ISBN.trim() === selectedISBN.value.trim() : true
    const matchesDate = selectedCreatedAt.value
      ? formatDateTime(form.createdAt) === selectedCreatedAt.value
      : true
    const matchesPrice = selectedPrice.value
      ? String(form.book_price) === String(selectedPrice.value)
      : true

    return matchesISBN && matchesDate && matchesPrice
  })
})

const fetchDataFromAPI = async ({ page, itemsPerPage }: { page: number; itemsPerPage: number }) => {
  try {
    const response = await axios.get('http://localhost:3000/offer-form', {
      params: {
        page,
        itemsPerPage,
      },
    })

    const data = response.data
    return {
      items: data.map((item: any) => ({
        ...item,
        store_name: item.store.store_name,
        book_imgs: Array.isArray(item.book_imgs) ? item.book_imgs : [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        form_status: item.form_status || 'รอการอนุมัติ', // เพิ่ม default
        offer_form_id: item.offer_form_id, // ดึง id จาก API
      })),
      total: data.length,
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { items: [], total: 0 }
  }
}

const fetchOfferForms = async (page = 1) => {
  loading.value = true
  const { items } = await fetchDataFromAPI({ page, itemsPerPage })
  offerForms.value = items
  loading.value = false
}

const onMessageClick = async (item) => {
  if (!item.offer_form_id) {
    console.error('Missing offer_form_id in item:', item)
    return // หยุดการทำงานถ้าไม่มี offer_form_id
  }

  selectedItem.value = item

  // อัปเดตวันที่และเวลา
  updateDateTime()

  try {
    // อัปเดต form_status และ duplicate_check ก่อนเปิด dialog
    await updateApproveStatus(item)

    // เปิด dialog ยืนยันการเลือก
    confirmDialog.value = true
  } catch (error) {
    console.error('Error updating approve status and duplicate_check:', error)
  }
}

const updateApproveStatus = async (item) => {
  if (!item.offer_form_id) {
    console.error('Missing offer_form_id in item:', item)
    return // หยุดการทำงานถ้าไม่มี offer_form_id
  }

  const url = `http://localhost:3000/offer-form/${item.offer_form_id}`
  const payload = {
    form_status: item.status, // ใช้ status แทน form_status
  }

  try {
    const response = await axios.patch(url, payload)
    console.log('Updated form_status successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error updating form_status:', error)
    throw error
  }
}

const approvePurchase = async () => {
  if (!selectedItem.value) {
    console.error('Selected item is null or undefined')
    return
  }

  try {
    // อัปเดตค่า status
    selectedItem.value.status = 'อนุมัติการซื้อ'

    // อัปเดตสถานะและเวลา
    await updateApproveStatus(selectedItem.value)
    updateDateTime() // อัปเดตวันเวลา

    // ปิด dialog
    confirmDialog.value = false
    console.log('การอนุมัติการซื้อสำเร็จ')
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอนุมัติการซื้อ:', error)
  }
}

const rejectPurchase = async () => {
  if (!selectedItem.value) {
    console.error('Selected item is null or undefined')
    return
  }

  try {
    // อัปเดตค่า status
    selectedItem.value.status = 'ไม่อนุมัติการซื้อ'

    // อัปเดตสถานะและเวลา
    await updateApproveStatus(selectedItem.value)
    updateDateTime() // อัปเดตวันเวลา

    // ปิด dialog
    confirmDialog.value = false
    console.log('การอนุมัติการซื้อถูกปฏิเสธ')
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการปฏิเสธการซื้อ:', error)
  }
}

const updateDateTime = () => {
  const now = new Date()
  fullDate.value = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  fullTime.value = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const onSearch = async () => {
  loading.value = true

  // ดึงข้อมูลจาก API
  const { items } = await fetchDataFromAPI({
    page: 1,
    itemsPerPage: itemsPerPage.value,
  })

  // ตรวจสอบข้อมูลที่ได้จาก API
  console.log('ข้อมูลจาก API:', items)

  // กรองข้อมูลโดยวันที่
  let filteredItems = filterDataByDate(items, selectedDate.value)

  // ตรวจสอบข้อมูลที่กรองโดยวันที่
  console.log('ข้อมูลหลังกรองวันที่:', filteredItems)

  // กรองข้อมูลโดย category ที่เลือก (ค่าเริ่มต้นเป็น "เสนอหนังสือออนไลน์")
  filteredItems = filteredItems.filter((item) => item.book_category === searchBook.value)

  // ตรวจสอบข้อมูลที่กรองด้วย category
  console.log('ข้อมูลหลังกรอง category:', filteredItems)

  // อัปเดตข้อมูลที่แสดงในตาราง
  serverItems.value = filteredItems
  totalItems.value = filteredItems.length

  // ถ้าไม่มีข้อมูลให้แสดงข้อความ "ไม่มีข้อมูล"
  noDataMessage.value = filteredItems.length === 0 ? 'ไม่มีข้อมูล' : ''

  loading.value = false
}

const viewImage = (item) => {
  if (item.book_imgs && item.book_imgs.length > 0) {
    selectedBookImage.value = item.book_imgs[0] // ดึงรูปภาพแรกจาก array
  } else {
    selectedBookImage.value = 'ไม่มีรูปภาพ'
  }
  console.log('selectedBookImage:', selectedBookImage.value)
  dialog.value = true // เปิด dialog เพื่อแสดงภาพหรือข้อความ
}

const fetchBooks = async (isbn: string) => {
  loading.value = true
  const apiUrl = `/api/ISBNISSN/${isbn}`

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log('API Response:', data)

    if (data?.status && data?.data) {
      const uniqueBooksMap = new Map<string, BookItem>()

      const isbnList: string[] = data.data.Info.filter(
        (item: { FIELD: string; DATA: string }) => item.FIELD === 'ISBN',
      ).map((item: { FIELD: string; DATA: string }) => item.DATA)

      isbnList.forEach((isbn) => {
        const bookInfo: BookItem = {
          book_title: '',
          book_author: '',
          ISBN: isbn,
          publisher: '',
          edition: '',
          description: '',
          detail: '',
          bookCover: data.data.BookCover.replace(/(^"|"$|\\)/g, '') || '',
        }

        data.data.Info.forEach((infoItem: { FIELD: string; DATA: string }) => {
          switch (infoItem.FIELD) {
            case 'Author':
              bookInfo.book_author = infoItem.DATA
              break
            case 'Title':
              if (infoItem.DATA.length > bookInfo.book_title.length) {
                bookInfo.book_title = infoItem.DATA
              }
              break
            case 'Edition':
              bookInfo.edition = infoItem.DATA
              break
            case 'Published':
              bookInfo.publisher = infoItem.DATA
              break
            case 'Detail':
              bookInfo.detail = infoItem.DATA
              break
            case 'Subject':
              bookInfo.description = infoItem.DATA
              break
            default:
              break
          }
        })

        console.log('Generated bookInfo:', bookInfo)

        if (!uniqueBooksMap.has(bookInfo.ISBN)) {
          uniqueBooksMap.set(bookInfo.ISBN, bookInfo)
        }
      })

      // อัปเดตข้อมูล booksData
      booksData.value = Array.from(uniqueBooksMap.values()) // อัปเดตข้อมูล booksData
      selectedISBN.value = isbn.trim() // อัปเดต selectedISBN ก่อนเปิด dialog
      // selectedCreatedAt.value = data.data.CreatedAt || ""  // กำหนดค่า selectedCreatedAt จากข้อมูล
      // selectedPrice.value = data.data.Price || "" // กำหนดค่า selectedPrice จากข้อมูล
      dialogSuccess.value = true // เปิด dialog

      console.log('Final serverItems:', serverItems.value)

      if (serverItems.value.length === 0) {
        alert('ไม่พบข้อมูลหนังสือที่ตรงกับการค้นหา')
      }
    } else {
      alert('ไม่พบข้อมูลหนังสือที่ตรงกับการค้นหา')
    }
  } catch (error) {
    console.error('Error fetching books:', error)
    alert(`ไม่สามารถเชื่อมต่อกับ API ได้: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const openImageDialog = (imageUrl) => {
  selectedImage.value = imageUrl
  dialogImage.value = true
}

// const confirmCheckStatus = async (item) => {
//   try {
//     // เรียกฟังก์ชัน updateApproveStatus เพื่ออัปเดต duplicate_check
//     await updateApproveStatus(item)

//     // แสดงผลใน console
//     console.log('Duplicate_check updated successfully!', item.duplicate_check)
//   } catch (error) {
//     console.error('Error updating duplicate_check:', error)
//   }
// }

// const cancelCheckStatus = () => {
//   if (confirmData.value) {
//     const originalStatus = confirmData.value.checkStatus
//     confirmData.value.checkStatus = originalStatus
//   }
//   confirmDialog.value = false
// }

// const confirmStatusChange = () => {
//   console.log('ยืนยันสถานะ:', confirmData.value)
//   confirmDialog.value = false
// }

// const sendMessage = () => {
//   console.log('ส่งข้อความ:', message.value, 'ไปยัง:', selectedItem.value)
//   messageDialog.value = false
// }

// onMounted(() => {
//   const today = new Date()
//   selectedDate.value = today
//   onSearch() // เรียกฟังก์ชันค้นหาทันทีเมื่อเริ่มต้น
// })

watch(
  selectedDate,
  async () => {
    loading.value = true

    // ดึงข้อมูลทั้งหมดจาก API
    const { items } = await fetchDataFromAPI({
      page: 1,
      itemsPerPage: itemsPerPage.value,
    })

    // กรองข้อมูลและเพิ่ม `rowIndex`
    const filteredItems = filterDataByDate(items, selectedDate.value)

    // อัปเดต `serverItems` ให้มีลำดับ
    serverItems.value = filteredItems
    totalItems.value = filteredItems.length

    loading.value = false
  },
  { immediate: true }, // เรียกทันทีตอนเริ่มต้น
)

watch(dialogSuccess, (newValue) => {
  if (newValue) {
    activeTab.value = 'duplicate' // รีเซ็ตค่าเมื่อ dialog เปิด
  }
})

onMounted(() => fetchOfferForms())
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-image {
  width: 60px;
  height: auto;
  margin-right: 15px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin: 0;
}

.date-status-row {
  margin-bottom: 20px;
}

/* เลือกวันที่และข้อมูลในตารางวันที่ */
.custom-date-picker {
  font-size: 20px;
  white-space: nowrap; /* ห้ามตัดข้อความขึ้นบรรทัดใหม่ */
  text-overflow: unset; /* ปิด ellipsis (...) */
  width: 100px;
  min-width: 200px;
  text-align: center; /* จัดข้อความอยู่กลาง */
  justify-content: center;
  align-content: center;
}

.v-input--is-prepended .v-input__prepend-inner-icon {
  font-size: 28px; /* ขนาดไอคอน */
}

.v-input--is-prepended.v-input--has-icon.v-input--is-dirty .v-input__prepend-inner-icon {
  font-size: 28px; /* ไอคอนขนาดใหญ่เมื่อ input มีค่าเปลี่ยนแปลง */
}

.custom-border {
  border-radius: 15px; /* ทำให้มุมโค้ง */
  padding: 4px 8px; /* เพิ่มพื้นที่ภายในให้ข้อความไม่ชิดขอบ */
  box-sizing: border-box; /* ให้ padding ไม่กระทบกับความกว้าง */
}

.custom-width {
  width: 250px; /* กำหนดความกว้างของ input */
}

.custom-date-picker:hover {
  border-color: #707478; /* เปลี่ยนสีกรอบตอนชี้ */
}

.v-date input {
  outline: none;
}

.duplicate-row {
  background-color: #ffe5e5 !important;
}

.custom-textdate {
  font-size: 20px; /* ขนาดข้อความ */
  border: none; /* ลบเส้นขอบ */
  outline: none; /* ลบเส้นโฟกัส */
  width: 100%; /* ให้ข้อความใช้พื้นที่เต็ม */
  height: 100%; /* ให้ข้อความครอบคลุมความสูง */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
  background-color: transparent;
  white-space: normal; /* ป้องกันการหักบรรทัด */
  overflow: hidden !important;
}

.custom-table {
  table-layout: fixed; /* ทำให้คอลัมน์มีความกว้างคงที่ */
  width: 100%;
  border-collapse: collapse; /* ลบเส้นว่างระหว่างเซลล์ */
  max-height: none;
}

.custom-table th {
  white-space: nowrap; /* ป้องกันการตัดข้อความ */
  text-align: left; /* จัดข้อความให้อยู่ด้านซ้าย */
  padding: 12px 16px; /* เพิ่มระยะห่างระหว่างข้อความ */
  border: 1px solid #ddd; /* เพิ่มเส้นแบ่งระหว่างเซลล์ */
}

.custom-table td {
  white-space: nowrap; /* ป้องกันการตัดข้อความ */
  text-align: left; /* จัดข้อความให้อยู่ด้านซ้าย */
  padding: 12px 16px; /* เพิ่มระยะห่างระหว่างข้อความ */
  border: 1px solid #ddd; /* เพิ่มเส้นแบ่งระหว่างเซลล์ */
}

.custom-table th {
  background-color: #f5f5f5; /* สีพื้นหลังหัวตาราง */
  font-weight: bold; /* ทำให้ข้อความหัวตารางหนา */
  font-size: 16px; /* ปรับขนาดฟอนต์ */
}

.custom-table td {
  font-size: 14px; /* ขนาดฟอนต์ของข้อมูล */
  line-height: 1.5; /* ระยะห่างระหว่างบรรทัด */
}

.custom-table th {
  text-overflow: ellipsis; /* เพิ่ม ... เมื่อข้อความเกินขอบเขต */
}

.custom-table td {
  text-overflow: ellipsis; /* เพิ่ม ... เมื่อข้อความเกินขอบเขต */
}

/* ปรับตารางให้อยู่กลาง */
.v-data-table {
  margin: 0 auto;
}

.formatted-date-display {
  text-align: center;
  margin-bottom: 20px;
}

.formatted-date-display h2 {
  font-size: 20px;
  font-weight: bold;
  color: #4e484a;
}

.select-isbn {
  width: 140px;
}

.serch-text {
  width: 400px;
}

.custom-isbn {
  width: 80px;
  height: 56px;
  line-height: 56px;
}

.select-book {
  width: 200px;
}

.custom-select {
  font-size: 12px !important; /* ขนาดตัวอักษรใน input */
  height: 36px !important;
  line-height: 1 !important;
}

.active-tab {
  background-color: #fcdc94 !important; /* เปลี่ยนสีพื้นหลัง */
  border: 2px solid #ff9800 !important; /* เพิ่มกรอบ */
  border-radius: 8px; /* ทำให้มุมมน */
  color: #333 !important; /* เปลี่ยนสีตัวอักษร */
}

.select-book .v-list-item-title {
  font-size: 14px;
  padding: 4px 8px;
}

.select-book .v-input {
  font-size: 16px; /* ขนาดตัวอักษรข้อความที่เลือก */
}

.duplicate-text {
  color: red;
  font-weight: bold;
  font-size: large;
}

.custom-table {
  width: 100%;
  table-layout: fixed;
  font-size: 14px; /* ปรับขนาดตัวอักษร */
}

.v-img img {
  max-width: 80px; /* ปรับขนาดความกว้าง */
  max-height: 100px; /* ปรับขนาดความสูง */
}

.dialog-container {
  max-height: 80vh;
  overflow-y: auto;
  padding: 10px;
}

::v-deep(.custom-select .v-input__control) {
  min-height: 36px !important;
  padding: 0 8px !important;
}

::v-deep(.custom-select .v-overlay .v-list-item) {
  min-height: 30px !important; /* ลดความสูงของรายการ */
  padding: 4px 8px !important; /* ลด padding */
}

::v-deep(.custom-select .v-list-item__title) {
  font-size: 10px !important; /* ลดขนาดฟอนต์ในรายการ */
  line-height: 1.2 !important; /* ปรับ line-height */
  white-space: nowrap; /* ป้องกันข้อความล้น */
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep(.custom-select .v-select__selections) {
  font-size: 12px !important; /* ลดขนาดตัวอักษรที่เลือก */
  line-height: 1.2 !important;
}

::v-deep(.v-overlay .v-list-item__title) {
  font-size: 10px !important; /* ลดฟอนต์ในเมนู overlay */
}
</style>
