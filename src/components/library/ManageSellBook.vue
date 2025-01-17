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

      <!-- Formatted Date Display -->
      <v-row>
        <v-col cols="auto">
          <div class="formatted-date-display">
            <h2>{{ fullFormattedDate }}</h2>
          </div>
        </v-col>
      </v-row>

      <!-- Search Filters Section -->
      <v-row align="center">
        <v-col cols="auto">
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
            placeholder="ค้นหา..."
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
        </v-col>

        <v-col cols="auto" class="ml-auto d-flex align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">ประเภท:</h3>
          <v-select
            :items="['ทั้งหมด', 'เสนอหนังสือ', 'Book Fair']"
            v-model="searchBook"
            class="select-book"
            variant="outlined"
            rounded="lg"
            @input="onSearch"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Data Table Section -->
      <v-data-table
        :headers="headers"
        :items="serverItems"
        style="width: 100%; table-layout: fixed; border-collapse: collapse"
        class="custom-table no-scrollbar"
        :hide-default-footer="true"
        :items-per-page="-1"
      >
        <template #item.image="{ item }">
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
        </template>

        <template #item.check="{ item }">
          <v-radio-group
            v-model="item.checkStatus"
            row
            @change="confirmCheckStatus(item)"
            style="margin-top: 20px"
          >
            <v-radio label="ไม่ซ้ำ" value="yes">
              <template v-slot:label>
                <span style="font-size: 14px; white-space: nowrap">ไม่ซ้ำ</span>
              </template>
            </v-radio>

            <v-radio label="ซ้ำ" value="no">
              <template v-slot:label>
                <span style="font-size: 14px; white-space: nowrap">ซ้ำ</span>
              </template>
            </v-radio>
          </v-radio-group>
        </template>

        <template #item.view="{ item }">
          <div style="display: flex; flex-direction: column; gap: 10px">
            <v-row>
              <v-col>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px">
                  <v-select
                    v-model="selcet.approvalStatus"
                    :items="['รอการอนุมัติ', 'กำลังดำเนินการ', 'ไม่อนุมัติการซื้อ']"
                    solo
                    dense
                    outlined
                    hide-details
                    variant="outlined"
                    class="custom-select"
                    style="
                      width: 120px !important;
                      height: 60px !important;
                      font-size: 8px !important;
                      line-height: 30px;
                      margin-top: 8px;
                    "
                  />

                  <v-btn
                    icon
                    @click="onMessageClick(item)"
                    style="
                      border-radius: 8px;
                      background-color: #b4c7e4;
                      width: 120px;
                      height: 30px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      margin-bottom: 8px;
                    "
                  >
                    <v-icon>mdi-email-outline</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </div>
        </template>
      </v-data-table>

      <!-- Image Viewer Dialog -->
      <v-dialog v-model="dialog" max-width="600">
        <v-card style="background-color: #e5e1da; border-radius: 16px">
          <v-card-actions style="background-color: #cecbcb">
            <v-btn text @click="dialog = false" style="font-size: 20px; font-weight: bold">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </v-card-actions>

          <v-spacer></v-spacer>
          <v-img
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
          <v-card-title>ยืนยันการเลือก</v-card-title>
          <v-card-text>
            คุณแน่ใจหรือไม่ว่าจะเปลี่ยนสถานะเป็น "{{
              confirmData?.checkStatus === 'yes' ? 'ไม่ซ้ำ' : 'ซ้ำ'
            }}"?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="cancelCheckStatus">ยกเลิก</v-btn>
            <v-btn color="green" text @click="confirmStatusChange">ยืนยัน</v-btn>
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
            <v-card-title>ส่ง: {{ selectedItem?.name }}</v-card-title>
            <v-card-subtitle>E-mail: {{ selectedItem?.email }}</v-card-subtitle>
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

// Date & Search Variables
const selectedDate = ref(new Date())
const menuDate = ref(false)
const searchCategory = ref('ISBN')
const searchBook = ref('ทั้งหมด')
const searchText = ref('')
const loading = ref(false)
const serverItems = ref([])
const dialog = ref(false)
const selectedBookImage = ref('')

const fullDate = ref('')
const fullTime = ref('')
// Dialog Management
const messageDialog = ref(false)
const confirmDialog = ref(false)
const selectedItem = ref(null)
const message = ref('')

const selcet = ref({
  approvalStatus: 'รอการอนุมัติ', // กำหนดค่าเริ่มต้นให้เป็น 'รอการอนุมัติ'
})

// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ข้อมูลผู้คัดเลือก', key: 'name' },
  { title: 'ชื่อหนังสือ', key: 'title' },
  { title: 'ISBN', key: 'isbn' },
  { title: 'ร้านค้า', key: 'shop' },
  { title: 'ราคาสุทธิ', key: 'price' },
  { title: 'จำนวน', key: 'quantity' },
  { title: 'รูปภาพ', key: 'image', align: 'center' },
  { title: 'ตรวจซ้ำ', key: 'check' },
  { title: 'ดำเนินการ', key: 'view' },
]

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

const onMessageClick = (item) => {
  selectedItem.value = item
  updateDateTime() // เรียกใช้ฟังก์ชันอัปเดตวันเวลา
  messageDialog.value = true // เปิด dialog
}

const updateDateTime = () => {
  const now = new Date() // ดึงวันเวลาปัจจุบัน
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

// API ปลอมเพื่อเลียนแบบการดึงข้อมูล
const FakeAPI = {
  async fetch({ page }: { page: number; itemsPerPage: number }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          {
            id: 1,
            name: 'นันท์ณภัทร สอนสุภาพ',
            title: 'ความรู้สึกของเราสำคัญที่สุด',
            date: '01/12/2567',
            isbn: '9783161484100',
            shop: 'แจ่มใส',
            price: 250,
            quantity: 2,
            status: 'เสนอหนังสือ',
            author: 'อีดงกวี',
            email: 'nan@gmail.com',
          },
          {
            id: 2,
            name: 'สมศรี ดีใจ',
            title: 'วิทยาศาสตร์ของการใช้ชีวิต = The science of living',
            date: '02/12/2567',
            isbn: '9780306406157',
            shop: 'แจ่มใส',
            price: 350,
            quantity: 1,
            status: 'Book Fair',
            author: 'Dr. Stuart Farrimond',
            email: 'somsi@gmail.com',
          },
          {
            id: 3,
            name: 'มงคล ปีใหม่',
            title:
              'คุณคางคกไปพบนักจิตบำบัด : การผจญภัยทางจิตวิทยา = Counselling for toads : a psychological adventure ',
            date: '03/12/2567',
            isbn: '9781402894656',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 3,
            status: 'Book Fair',
            author: 'Robert de Board',
            email: 'monkol@gmail.com',
          },
          {
            id: 4,
            name: 'เปี๊ยก แฮปปี้',
            title: 'ร่างกายไม่เคยโกหก = What every body is saying',
            date: '20/12/2567',
            isbn: '9787402894626',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 1,
            status: 'Book Fair',
            author: 'Joe Navarro',
            email: 'piek@gmail.com',
          },
          {
            id: 5,
            name: 'นวรรษ สีหบุตร',
            title: 'ภาวะลื่นไหล ทำอะไรก็ง่ายหมด = Productivity flow',
            date: '20/12/2567',
            isbn: '9781502894626',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 1,
            status: 'เสนอหนังสือ',
            author: 'สิทธินันท์ พลวิสุทธิ์ศักดิ์',
            email: 'nawapat@gmail.com',
          },
          {
            id: 6,
            name: 'สีดา จันทรา',
            title: 'หัวไม่ดีก็มีวิธีสอบผ่าน',
            date: '14/01/2568',
            isbn: '9786165786195',
            shop: 'แจ่มใส',
            price: 500,
            quantity: 1,
            status: 'เสนอหนังสือ',
            author: 'จิตเกษม น้อยไร่ภูมิ',
            email: 'sita@gmail.com',
          },
        ]

        resolve(data)
      }, 500)
    })
  },
}

const onSearch = () => {
  loading.value = true
  FakeAPI.fetch({ page: 1, itemsPerPage: 10 }).then((items) => {
    let filteredItems = items

    if (selectedDate.value) {
      const selectedFormattedDate = formattedDate.value
      filteredItems = filteredItems.filter((item) => item.date === selectedFormattedDate)
    }

    if (searchBook.value !== 'ทั้งหมด') {
      filteredItems = filteredItems.filter((item) => item.status === searchBook.value)
    }

    if (searchText.value && searchCategory.value) {
      const searchValue = searchText.value.toLowerCase()
      filteredItems = filteredItems.filter((item) => {
        if (searchCategory.value === 'TITLE') return item.title.toLowerCase().includes(searchValue)
        if (searchCategory.value === 'ISBN') return item.isbn.toLowerCase().includes(searchValue)
        if (searchCategory.value === 'AUTHOR' && item.author)
          return item.author.toLowerCase().includes(searchValue)
        return true
      })

      menuDate.value = false
    }

    // หากไม่มีการกรองเพิ่มเติมและไม่มีวันที่ที่เลือก ให้แสดงข้อมูลทั้งหมด
    if (!selectedDate.value && !searchBook.value && !searchText.value) {
      filteredItems = items
    }

    // อัปเดตข้อมูลตาราง
    serverItems.value = filteredItems

    // หากไม่มีข้อมูลให้เตือนใน console
    if (filteredItems.length === 0) {
      console.warn('No data found with the selected criteria.')
    }

    loading.value = false
    menuDate.value = false
  })
}

const viewImage = (item) => {
  selectedBookImage.value = item.image || defaultImage
  dialog.value = true
}
const toggleImage = () => {
  selectedBookImage.value = selectedBookImage.value === defaultImage ? backImage : defaultImage
}

// ฟังก์ชันเปิด Dialog ยืนยัน
const confirmCheckStatus = (item) => {
  confirmData.value = { ...item }
  confirmDialog.value = true
}

// ยกเลิกการเปลี่ยนแปลง
const cancelCheckStatus = () => {
  if (confirmData.value) {
    const originalStatus = confirmData.value.checkStatus
    confirmData.value.checkStatus = originalStatus
  }
  confirmDialog.value = false
}

// ยืนยันการเปลี่ยนแปลง
const confirmStatusChange = () => {
  console.log('ยืนยันสถานะ:', confirmData.value)
  confirmDialog.value = false
}

const sendMessage = () => {
  console.log('ส่งข้อความ:', message.value, 'ไปยัง:', selectedItem.value)
  messageDialog.value = false
}

onMounted(() => {
  const today = new Date()
  selectedDate.value = today
  onSearch() // เรียกฟังก์ชันค้นหาทันทีเมื่อเริ่มต้น
})

watch([selectedDate, searchBook], onSearch, { immediate: true })
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

.no-scrollbar {
  overflow-x: hidden;
  overflow-y: hidden;
  overflow: hidden !important; /* ซ่อนทั้งแนวตั้งและแนวนอน */
  -ms-overflow-style: none; /* สำหรับ IE และ Edge */
  scrollbar-width: none; /* สำหรับ Firefox */
}

.no-scrollbar::-webkit-scrollbar {
  display: none; /* ซ่อน scrollbar สำหรับ Chrome, Safari */
}

.custom-select .v-input__control .v-input__slot {
  font-size: 10px !important; /* ปรับขนาดฟอนต์ให้เล็กลง */
}

.custom-select .v-select__selections {
  font-size: 10px !important; /* ปรับขนาดฟอนต์ในรายการเลือก */
}

.custom-select .v-select__input {
  font-size: 10px !important; /* ปรับขนาดฟอนต์ในช่องป้อนข้อมูล */
}
</style>
