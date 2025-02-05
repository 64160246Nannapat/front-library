<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/file (1).png" alt="Library Image" />
        <h1>ประวัติการขาย</h1>

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
                  readonly
                  flat
                  solo
                  prepend-inner-icon="$calendar"
                  suffix-icon="mdi-calendar"
                  variant="outlined"
                  rounded="lg"
                />
              </template>

              <v-date-picker v-model="selectedDate" @input="menuDate = false" locale="th" />
            </v-menu>
          </v-col>
        </v-row>
      </div>

      <v-row class="d-flex" style="width: 100%">
        <v-col cols="auto" class="d-flex justify-start">
          <div class="formatted-date-display">
            <h2>{{ fullFormattedDate }}</h2>
          </div>
        </v-col>

        <v-spacer></v-spacer>
        <!-- เพิ่มช่องว่างระหว่างวันที่และปุ่ม -->

        <v-col cols="auto" class="d-flex justify-end">
          <v-btn
            style="
              margin-right: -20px;
              background-color: #c7c8cc;
              width: 200px;
              height: 40px;
              font-size: 14px;
              font-weight: bold;
            "
            @click="onClickFile"
            ><v-icon left style="margin-right: 8px; font-weight: bold">mdi-tray-arrow-down</v-icon>
            DOWNLOAD PDF
          </v-btn>
        </v-col>
      </v-row>

      <!-- ตารางข้อมูล -->
      <v-data-table
        :headers="headers"
        :items="serverItems"
        :loading="loading"
        @update:options="loadItems"
        :hide-default-footer="true"
        :items-per-page="-1"
        style="margin-top: 30px"
      />

      <v-divider></v-divider>

      <!-- รวมข้อมูล -->
      <v-row class="mt-4">
        <v-col cols="6" class="text-start" style="font-weight: bold">
          รวม: <b>{{ total.price }}</b> บาท
        </v-col>
        <v-col cols="6" class="text-end" style="font-weight: bold">
          จำนวน: <b>{{ total.quantity }}</b> เล่ม
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import BuuLogo from '@/assets/Buu-logo11.png'

// วันที่
const selectedDate = ref(new Date())
const menuDate = ref(false)
const loading = ref(false)
const serverItems = ref([])

// Headers สำหรับ v-data-table
const headers = [
  { title: 'ลำดับ', key: 'id', align: 'start' },
  { title: 'ชื่อหนังสือ', key: 'title' },
  { title: 'ISBN', key: 'isbn' },
  { title: 'ราคาสุทธิ', key: 'price' },
  { title: 'จำนวน', key: 'quantity' },
  { title: 'ประเภท', key: 'type' },
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

// API ปลอมเพื่อเลียนแบบการดึงข้อมูล
const FakeAPI = {
  async fetch({ page, itemsPerPage }: { page: number; itemsPerPage: number }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          {
            id: 1,
            title: 'ความรู้สึกของเราสำคัญที่สุด',
            date: '06/02/2568',
            isbn: '9786161857707',
            price: 250,
            quantity: 2,
            type: 'มีคูปอง',
          },
          {
            id: 2,
            title: 'วิทยาศาสตร์ของการใช้ชีวิต = The science of living',
            date: '06/02/2568',
            isbn: '9786162875434',
            price: 350,
            quantity: 1,
            type: 'ไม่มีคูปอง',
          },
          {
            id: 3,
            title:
              'คุณคางคกไปพบนักจิตบำบัด : การผจญภัยทางจิตวิทยา = Counselling for toads : a psychological adventure ',
            date: '06/02/2568',
            isbn: '9786160459049',
            price: 500,
            quantity: 3,
            type: 'ไม่มีคูปอง',
          },
          {
            id: 4,
            title: 'ร่างกายไม่เคยโกหก = What every body is saying',
            date: '06/02/2568',
            isbn: '9786162875687',
            price: 500,
            quantity: 1,
            type: 'ไม่มีคูปอง',
          },
          {
            id: 5,
            title: 'ภาวะลื่นไหล ทำอะไรก็ง่ายหมด = Productivity flow',
            date: '06/02/2568',
            isbn: '9786169373964',
            price: 500,
            quantity: 1,
            type: 'มีคูปอง',
          },
          {
            id: 6,
            title: 'หัวไม่ดีก็มีวิธีสอบผ่าน',
            date: '06/02/2568',
            isbn: '9786165786195',
            price: 500,
            quantity: 1,
            type: 'มีคูปอง',
          },
        ]

        resolve({
          items: data,
          total: data.length,
        })
      }, 500)
    })
  },
}

// คำนวณราคาและจำนวนหนังสือรวม
const total = computed(() => {
  const price = serverItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const quantity = serverItems.value.reduce((sum, item) => sum + item.quantity, 0)
  return {
    price, // รวมราคา
    quantity, // รวมจำนวน
  }
})

// โหลดข้อมูล
const loadItems = ({ page, itemsPerPage }: { page: number; itemsPerPage: number }) => {
  loading.value = true
  FakeAPI.fetch({ page, itemsPerPage }).then(({ items, total }) => {
    // กรองข้อมูลตามวันที่ที่เลือก
    const filteredItems = items.filter((item) => {
      // แปลงวันที่ใน item จาก dd/mm/yyyy เป็น Date object
      const [day, month, year] = item.date.split('/').map((part) => parseInt(part))
      const itemDate = new Date(year - 543, month - 1, day) // ลด 543 ปีสำหรับปีไทย

      // เปรียบเทียบวันที่
      return itemDate.toDateString() === selectedDate.value.toDateString()
    })
    serverItems.value = filteredItems
    loading.value = false
    menuDate.value = false
  })
}

const onSearch = () => {
  loadItems({ page: 1, itemsPerPage: 5 }) // เรียกใช้ฟังก์ชันกรองเมื่อวันที่เปลี่ยน
}

const loadFontAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Cannot load font')
  const buffer = await response.arrayBuffer()
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

const imageBuu = async () => {
  const response = await fetch(BuuLogo)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1]) // Return base64 string
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ฟอร์แมตวันที่แบบกำหนดเอง
const formatDatePdf = (): string => {
  const now = new Date()
  const yearBuddhist = now.getFullYear() + 543 // เปลี่ยนเป็นปี พ.ศ.
  const month = String(now.getMonth() + 1).padStart(2, '0') // เดือน (01-12)
  const day = String(now.getDate()).padStart(2, '0') // วัน (01-31)
  const hours = String(now.getHours()).padStart(2, '0') // ชั่วโมง (00-23)
  const minutes = String(now.getMinutes()).padStart(2, '0') // นาที (00-59)
  return `${day}/${month}/${yearBuddhist} ${hours}:${minutes}`
}

const onClickFile = async () => {
  // เรียก FakeAPI เพื่อดึงข้อมูล
  const { items } = await FakeAPI.fetch({ page: 1, itemsPerPage: 5 })

  // กรองข้อมูลเฉพาะวันที่ที่เลือก
  const filteredItems = items.filter((item) => {
    const [day, month, year] = item.date.split('/').map(Number)
    const itemDate = new Date(year - 543, month - 1, day) // แปลงเป็น Date object
    return itemDate.toDateString() === selectedDate.value.toDateString()
  })

  // ตรวจสอบว่ามีข้อมูลหรือไม่
  if (filteredItems.length === 0) {
    alert('ไม่มีข้อมูลหนังสือสำหรับวันที่ที่เลือก')
    return
  }

  // สร้าง PDF
  const doc = new jsPDF()

  // โหลดฟอนต์ Sarabun
  const fontBase64 = await loadFontAsBase64('/Sarabun/Sarabun-Regular.ttf')
  doc.addFileToVFS('Sarabun-Regular.ttf', fontBase64)
  doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal')
  doc.setFont('Sarabun', 'normal')
  doc.setFontSize(16)

  // โหลดโลโก้ BUU
  const logoBase64 = await imageBuu()
  const logoWidth = 30
  const logoHeight = 30
  const logoX = (doc.internal.pageSize.width - logoWidth) / 2
  const logoY = 20
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight)

  // เพิ่มข้อความส่วนหัว
  const text = 'สรุปงบประมาณ'
  const textX = (doc.internal.pageSize.width - doc.getTextWidth(text)) / 2
  const textY = logoY + logoHeight + 10
  doc.text(text, textX, textY)

  doc.setFontSize(14)
  const subText = `ประจำวันที่ ${formattedDate.value}`
  const subTextX = (doc.internal.pageSize.width - doc.getTextWidth(subText)) / 2
  const subTextY = textY + 10
  doc.text(subText, subTextX, subTextY)

  // เพิ่มวันที่
  doc.setFontSize(10)
  const pdfDate = formatDatePdf()
  const dateX = doc.internal.pageSize.width - doc.getTextWidth(pdfDate) - 10
  const dateY = 10
  doc.text(pdfDate, dateX, dateY)

  // เตรียมข้อมูลตาราง
  const tableData = filteredItems.map((item, index) => [
    (index + 1).toString(),
    item.title,
    item.quantity.toString(),
    (item.price * item.quantity).toLocaleString(),
  ])

  // สร้างตาราง
  autoTable(doc, {
    head: [['ลำดับ', 'ชื่อหนังสือ', 'จำนวน', 'จำนวนเงิน (บาท)']],
    body: tableData,
    startY: subTextY + 20,
    styles: {
      font: 'Sarabun',
      fontSize: 12,
    },
    headStyles: {
      fillColor: [102, 102, 0],
      textColor: [255, 255, 255],
      font: 'Sarabun',
      fontSize: 12,
    },
  })

  // เพิ่มผลรวมด้านล่าง
  const totalPrice = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalText = `งบประมาณรวม ${totalPrice.toLocaleString()} บาท`
  doc.setFontSize(14)
  doc.text(
    totalText,
    doc.internal.pageSize.width - doc.getTextWidth(totalText) - 10,
    doc.lastAutoTable.finalY + 10,
  )

  // บันทึก PDF
  doc.save('budget-summary.pdf')
}

watch([selectedDate], onSearch, { immediate: true })

// โหลดข้อมูลเริ่มต้น
onMounted(() => {
  loadItems({ page: 1, itemsPerPage: 5 })
})
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
  overflow: visible; /* แสดงข้อความที่เกิน */
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
  overflow: visible;
}

/* ตาราง */
.v-simple-table {
  width: 100%; /* ขยายตารางให้เต็มความกว้างคอนเทนเนอร์ */
  max-width: 100%; /* กำหนดให้ไม่เกินความกว้างของหน้าจอ */
  margin: 0 auto; /* จัดตารางให้อยู่กลางหน้าจอ */
  font-size: 18px;
  border-collapse: collapse; /* รวมเส้นขอบตาราง */
  overflow-x: auto;
  table-layout: auto; /* ช่วยให้ตารางขยายได้ตามขนาดข้อมูล */
}

th,
td {
  padding: 16px;
  text-align: left;
  width: 16%; /* ปรับความกว้างให้แต่ละคอลัมน์สมดุล */
}

th {
  font-weight: bold;
  font-size: 20px;
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
</style>
