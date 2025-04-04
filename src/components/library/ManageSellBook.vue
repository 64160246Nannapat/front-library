<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container fluid>
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

              <!-- 📌 ปิดปฏิทินอัตโนมัติเมื่อเลือกวันที่ -->
              <v-date-picker v-model="selectedDate" locale="th" @update:modelValue="closeMenu" />
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
      <v-row>
        <!-- ปุ่มกรองตามสถานะ -->
        <v-col cols="12" md="6" lg="4" class="ml-0 d-flex justify-start align-center">
          <v-btn-toggle v-model="selectedStatus" mandatory @update:modelValue="onFilter">
            <!-- ถ้าเลือกประเภท "เสนอหนังสืองานหนังสือ" -->
            <v-btn
              v-if="selectedCategory === 'เสนอหนังสืองานหนังสือ'"
              value="กำลังดำเนินการ"
              :class="selectedStatus === 'กำลังดำเนินการ' ? 'active-tab' : 'inactive-tab'"
              style="border-radius: 16px"
            >
              กำลังดำเนินการ
            </v-btn>
            <v-btn
              v-if="selectedCategory === 'เสนอหนังสืองานหนังสือ'"
              value="ไม่อนุมัติการซื้อ"
              :class="selectedStatus === 'ไม่อนุมัติการซื้อ' ? 'active-tab' : 'inactive-tab'"
              style="border-radius: 16px"
            >
              ไม่อนุมัติการซื้อ
            </v-btn>
            <v-btn
              v-if="selectedCategory === 'เสนอหนังสืองานหนังสือ'"
              value="อนุมัติการซื้อ"
              :class="selectedStatus === 'อนุมัติการซื้อ' ? 'active-tab' : 'inactive-tab'"
              style="border-radius: 16px"
            >
              อนุมัติการซื้อ
            </v-btn>

            <!-- ถ้าเลือกประเภท "เสนอหนังสือทั่วไป" -->
            <v-btn
              v-if="selectedCategory === 'เสนอหนังสือทั่วไป'"
              value="กำลังดำเนินการ"
              :class="selectedStatus === 'กำลังดำเนินการ' ? 'active-tab' : 'inactive-tab'"
              style="border-radius: 16px"
            >
              กำลังดำเนินการ
            </v-btn>
            <v-btn
              v-if="selectedCategory === 'เสนอหนังสือทั่วไป'"
              value="อนุมัติการซื้อ"
              :class="selectedStatus === 'อนุมัติการซื้อ' ? 'active-tab' : 'inactive-tab'"
              style="border-radius: 16px"
            >
              ระบุราคาหนังสือ
            </v-btn>
            <v-btn
              v-if="selectedCategory === 'เสนอหนังสือทั่วไป'"
              value="สถานะการอนุมัติ"
              :class="selectedStatus === 'สถานะการอนุมัติ' ? 'active-tab' : 'inactive-tab'"
              style="border-radius: 16px"
            >
              สถานะการอนุมัติ
            </v-btn>
          </v-btn-toggle>
        </v-col>

        <!-- เลือกประเภท -->
        <v-col cols="12" md="6" lg="4" class="ml-auto d-flex justify-end align-center">
          <h3 style="margin-right: 20px; margin-top: -20px">ประเภท:</h3>
          <v-select
            :items="['เสนอหนังสือทั่วไป', 'เสนอหนังสืองานหนังสือ']"
            v-model="selectedCategory"
            class="select-book"
            variant="outlined"
            rounded="lg"
            @update:modelValue="onSearch"
          ></v-select>
        </v-col>
      </v-row>

      <!-- ตารางสำหรับ "เสนอหนังสือทั่วไป" -->
      <v-data-table
        v-if="selectedCategory === 'เสนอหนังสือทั่วไป'"
        :headers="computedHeaders"
        :items="filteredItems"
        :loading="loading"
        item-value="offer_form_id"
        class="custom-table"
        v-model:expanded="expandedItems"
      >
        <template #item.rowIndex="{ index }">
          {{ index + 1 }}
        </template>

        <!-- ราคา -->
        <template #item.price="{ item }">
          {{ item.price === 0 ? 'ไม่ได้ระบุราคา' : item.price }}
        </template>

        <!-- ตรวจสอบหนังสือ -->
        <template #item.check="{ item }">
          <v-btn
            :style="{ backgroundColor: '#CAA6A6', color: '#944E63' }"
            @click="toggleExpand(item)"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>

        <!-- ดำเนินการ -->
        <template #item.send="{ item }">
          <v-btn
            :style="{ backgroundColor: '#AAB99A', color: '#727D73' }"
            @click="openDialog(item)"
          >
            <v-icon left style="margin-right: 5px; font-size: 25px">mdi-list-status</v-icon>
          </v-btn>
        </template>

        <!-- ระบุราคา -->
        <template #item.specify="{ item }">
          <v-btn
            :style="{ backgroundColor: '#AAB99A', color: '#727D73' }"
            :disabled="item.price !== 0"
            @click="openPriceDialog(item)"
          >
            <v-icon left style="margin-right: 5px; font-size: 25px">
              {{ item.price === 0 ? 'mdi-pencil' : 'mdi-check' }}
              <!-- ใช้ไอคอนตามค่า price -->
            </v-icon>
          </v-btn>
        </template>

        <template v-slot:item.form_status="{ item }">
          <span :class="getStatusClass(item.form_status)">
            {{ item.form_status }}
          </span>
        </template>

        <!--ตารางแทรก-->
        <template #expanded-row="{ item }">
          <tr v-if="expandedItems.includes(item.offer_form_id)">
            <td :colspan="computedHeaders.length + 1">
              <v-container fluid>
                <v-data-table
                  v-if="duplicateItems.length > 0"
                  :headers="computedSubHeaders"
                  :items="duplicateItems"
                  item-value="offer_form_id"
                  class="custom-table"
                  hide-default-footer
                  fixed-header
                >
                  <!-- แสดงเวลาเมื่อกด toggleExpand -->
                  <template #item.updatedAt="{ item }">
                    <span>{{ item.toggleExpandTime || '-' }}</span>
                  </template>

                  <!-- รายการหนังสือซ้ำ -->
                  <template #item.rowIndex="{ index }">
                    {{ index + 1 }}
                  </template>
                  <template #item.user_fullname="{ item }">
                    <span>{{ item.user_name || '-' }}</span>
                  </template>
                  <template #item.book_title="{ item }">
                    <span>{{ item.book_title }}</span>
                  </template>
                  <template #item.form_status="{ item }">
                    <span style="color: red; font-weight: bold">เสนอซ้ำ</span>
                  </template>

                  <template #item.send="{ item }">
                    <v-btn
                      :style="{ backgroundColor: '#AAB99A', color: '#727D73' }"
                      @click="openDialog(item)"
                    >
                      <v-icon left style="margin-right: 5px; font-size: 25px"
                        >mdi-list-status</v-icon
                      >
                    </v-btn>
                  </template>
                  <!-- ระบุราคา -->
                  <template #item.specify="{ item }">
                    <v-btn
                      :style="{ backgroundColor: '#AAB99A', color: '#727D73' }"
                      :disabled="item.price !== 0"
                      @click="openPriceDialog(item)"
                    >
                      <v-icon left style="margin-right: 5px; font-size: 25px">
                        {{ item.price === 0 ? 'mdi-pencil' : 'mdi-check' }}
                        <!-- ใช้ไอคอนตามค่า price -->
                      </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
                <div v-else style="text-align: center; padding: 20px; color: grey">
                  ไม่มีรายการหนังสือซ้ำ
                </div>
              </v-container>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!-- ตารางสำหรับ "เสนอหนังสืองานหนังสือ" -->
      <v-data-table
        v-else-if="selectedCategory === 'เสนอหนังสืองานหนังสือ'"
        :headers="formOfl"
        :items="filteredItems"
        :loading="loading"
        item-value="offer_form_id"
        class="custom-table"
      >
        <template #item.rowIndex="{ index }">
          {{ index + 1 }}
        </template>

        <!-- แสดงรูปภาพ -->
        <template #item.image="{ item }">
          <v-img v-if="item.image" :src="item.image" max-height="50" max-width="50"></v-img>
          <div v-else>-</div>
        </template>

        <!-- ตรวจสอบหนังสือ -->
        <template #item.check="{ item }">
          <v-btn
            :style="{ backgroundColor: '#CAA6A6', color: '#944E63' }"
            @click="toggleExpand(item)"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>

        <template #expanded-row="{ item }">
          <tr v-if="expandedItems.includes(item.offer_form_id)">
            <td :colspan="formOfl.length + 1" style="padding: 0">
              <v-container fluid>
                <v-data-table
                  :headers="subHeadersOfl"
                  :items="getDuplicateItems(item)"
                  item-value="offer_form_id"
                  class="custom-table no-scrollbar"
                  style="background-color: #f5f5f5"
                  :hide-default-footer="true"
                  fixed-header
                >
                  <template v-slot:item.user_fullname="{ item }">
                    <span>{{ item.user_fullname || '-' }}</span>
                  </template>
                  <template v-slot:item.toggleExpandTime="{ item }">
                    <span>{{ getCheckedTimestamp(item) }}</span>
                  </template>
                  <template v-slot:item.send="{ item }">
                    <v-btn color="primary" @click="onActionClick(item)"> ดำเนินการ </v-btn>
                  </template>
                </v-data-table>
              </v-container>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!-- Dialog -->
      <!-- Dialog ยืนยันการอนุมัติ -->
      <v-dialog v-model="confirmDialog" max-width="750">
        <v-card style="background-color: #ede8dc">
          <v-card-title
            class="d-flex justify-space-between align-center text-start"
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
            <span>ยืนยันการดำเนินการ</span>
            <v-icon
              @click="confirmDialog = false"
              color="red"
              class="cursor-pointer"
              style="font-size: 35px"
            >
              mdi-close
            </v-icon>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="6">
                <p>
                  <strong>งบประมาณคณะคงเหลือ:</strong>
                  {{ selectedItem?.faculty_e_coupon || 'ไม่ระบุ' }}
                </p>
              </v-col>
              <v-col cols="6">
                <p>
                  <strong>งบประมาณสาขาคงเหลือ:</strong>
                  {{ selectedItem?.department_e_coupon || 'ไม่ระบุ' }}
                </p>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>
            <p><strong>ชื่อผู้เสนอ:</strong> {{ selectedItem?.user_fullname || 'ไม่ระบุ' }}</p>
            <p><strong>คณะ:</strong> {{ selectedItem?.faculty_name || 'ไม่ระบุ' }}</p>
            <p><strong>สาขา:</strong> {{ selectedItem?.department_name || 'ไม่ระบุ' }}</p>
            <p><strong>ชื่อหนังสือ:</strong> {{ selectedItem?.book_title || 'ไม่ระบุ' }}</p>
            <p><strong>ISBN:</strong> {{ selectedItem?.ISBN || 'ไม่ระบุ' }}</p>
            <p>
              <strong>ราคา:</strong>
              {{
                selectedItem?.book_price === 0
                  ? 'ไม่ได้ระบุราคา'
                  : selectedItem?.book_price
                    ? selectedItem?.book_price + ' บาท'
                    : 'ไม่ได้ระบุราคา'
              }}
            </p>

            <!-- แสดงข้อมูลใน Console -->
            <pre>{{ console.log(selectedItem) }}</pre>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="black"
              text
              @click="rejectPurchase"
              style="
                font-weight: bold;
                border-radius: 8px;
                background-color: #fa8072;
                margin-bottom: 8px;
              "
            >
              ไม่อนุมัติการซื้อ
            </v-btn>
            <v-btn
              color="black"
              text
              @click="approvePurchase"
              style="
                font-weight: bold;
                border-radius: 8px;
                background-color: #58d68d;
                margin-bottom: 8px;
              "
            >
              อนุมัติการซื้อ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog แสดงการดำเนินการเสร็จสิ้น -->
      <v-dialog v-model="completeDialog" max-width="500">
        <v-card>
          <v-card-title class="text-center" style="font-size: 18px; font-weight: bold">
            ดำเนินการเสร็จสิ้น
          </v-card-title>
          <v-card-text class="text-center"> สถานะการดำเนินการได้อัพเดตเรียบร้อยแล้ว </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="completeDialog = false" block> ปิด </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog กรอกราคา -->
      <v-dialog v-model="priceDialog" max-width="750">
        <v-card style="background-color: #ede8dc">
          <v-card-title
            class="d-flex justify-space-between align-center text-start"
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
            <span>กำหนดราคา</span>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <strong>เลือกแหล่งหักเงิน</strong>
                <v-checkbox
                  v-for="(source, index) in fundingSources"
                  :key="index"
                  v-model="selectedSource"
                  :value="source.key"
                  :label="`${source.name}: ${(source.amount || 0).toLocaleString()} บาท`"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model.number="priceInput"
              label="กรอกราคา"
              type="number"
              min="0"
              prepend-icon="mdi-currency-thb"
            ></v-text-field>

            <p>
              <strong>ยอดเงินรวมที่เลือก:</strong> {{ totalSelectedAmount.toLocaleString() }} บาท
            </p>
            <p><strong>ราคาที่ต้องการหัก:</strong> {{ priceInput.toLocaleString() }} บาท</p>
            <p>
              <strong>สถานะ:</strong>
              <span v-if="totalSelectedAmount === 0 || priceInput === 0"> -</span>
              <span v-else-if="totalSelectedAmount >= priceInput">✅ เพียงพอ</span>
              <span v-else>⚠️ ไม่เพียงพอ</span>
            </p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="black"
              text
              @click="priceDialog = false"
              style="
                font-weight: bold;
                border-radius: 8px;
                background-color: #fa8072;
                margin-bottom: 8px;
              "
            >
              ยกเลิก
            </v-btn>
            <v-btn
              color="black"
              text
              :disabled="
                totalSelectedAmount === 0 || priceInput === 0 || totalSelectedAmount < priceInput
              "
              @click="updatePrice"
              style="
                font-weight: bold;
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
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const selectedDate = ref(null)
const menuDate = ref(false)

const selectedCategory = ref('เสนอหนังสือทั่วไป')
const selectedStatus = ref('กำลังดำเนินการ')
const selectedSource = ref(null)
const confirmDialog = ref(false)
const completeDialog = ref(false)
const priceDialog = ref(false)
const selectedItem = ref({})
const loading = ref(false)
const items = ref([])
const duplicateItems = ref([]) // เก็บข้อมูลหนังสือซ้ำ
const expandedItems = ref([]) // เก็บรายการที่เปิดตารางแทรก
const toggleExpandTime = ref<string | null>(null)
const checkedTimestamps = ref<{ [key: string]: string }>({})

const priceInput = ref(0)

const categories = ['เสนอหนังสือทั่วไป', 'เสนอหนังสืองานหนังสือ']

const getStatusClass = (status: string) => {
  switch (status) {
    case 'กำลังดำเนินการ':
      return 'status-pending'
    case 'อนุมัติการซื้อ':
      return 'status-approved'
    case 'ไม่อนุมัติการซื้อ':
      return 'status-rejected'
    default:
      return ''
  }
}

// 📌 ฟอร์แมตวันที่เป็น "dd/mm/yyyy"
const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear() + 543
  return `${day}/${month}/${year}`
})

// 📌 ปิดปฏิทินเมื่อเลือกวันที่
const closeMenu = (newDate) => {
  selectedDate.value = newDate
  menuDate.value = false
}

// 📌 ฟอร์แมตวันที่เต็มรูปแบบ
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

// 📌 ฟังก์ชันแปลงวันที่เวลาเป็นรูปแบบ "dd/mmm/yyyy เวลา hh:mm น."
// const formatDateTime = (isoString: string | null): string => {
//   if (!isoString) return '-' // ถ้าไม่มีข้อมูล

//   // แปลงเป็น Date object
//   const date = new Date(isoString)

//   // ตรวจสอบว่า date ถูกต้องหรือไม่
//   if (isNaN(date.getTime())) return '-'

//   // ตั้งค่าการแสดงผลเป็นภาษาไทย
//   const formattedDate = date.toLocaleDateString('th-TH', {
//     year: '2-digit', // ปี ค.ศ. -> พ.ศ. (2 หลัก)
//     month: 'short', // เดือนแบบย่อ เช่น มี.ค.
//     day: 'numeric', // วันที่ เช่น 13
//   })

//   const formattedTime = date.toLocaleTimeString('th-TH', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false, // ใช้รูปแบบ 24 ชั่วโมง
//   })

//   return `${formattedDate} เวลา ${formattedTime} น.`
// }

// 📌 Headers สำหรับ "เสนอหนังสือทั่วไป"
const formOnl = [
  { title: 'ลำดับ', key: 'rowIndex', width: '50px', align: 'start' },
  { title: 'ชื่อผู้เสนอ', key: 'user_fullname', width: '150px' },
  { title: 'อีเมล', key: 'user_email', width: '120px' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '200px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '100px' },
  { title: 'ISBN', key: 'ISBN', width: '100px' },
  { title: 'ราคา', key: 'price', width: '100px' },
  { title: 'รายละเอียด', key: 'form_description', width: '150px' },
  { title: 'ตรวจหนังสือ', key: 'check', width: '150px' },
  { title: 'ดำเนินการ', key: 'send', width: '150px' },
]

const formOnlprice = [
  { title: 'ลำดับ', key: 'rowIndex', width: '50px', align: 'start' },
  { title: 'ชื่อผู้เสนอ', key: 'user_fullname', width: '150px' },
  { title: 'อีเมล', key: 'user_email', width: '120px' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '200px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '100px' },
  { title: 'ISBN', key: 'ISBN', width: '100px' },
  { title: 'ราคา', key: 'price', width: '100px' },
  { title: 'รายละเอียด', key: 'form_description', width: '150px' },
  { title: 'ตรวจหนังสือ', key: 'check', width: '150px' },
  { title: 'ระบุราคา', key: 'specify', width: '150px' },
]

const formOnlstatus = [
  { title: 'ลำดับ', key: 'rowIndex', width: '50px', align: 'start' },
  { title: 'ชื่อผู้เสนอ', key: 'user_fullname', width: '150px' },
  { title: 'อีเมล', key: 'user_email', width: '120px' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '200px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '100px' },
  { title: 'ISBN', key: 'ISBN', width: '100px' },
  { title: 'ราคา', key: 'price', width: '100px' },
  { title: 'รายละเอียด', key: 'form_description', width: '150px' },
  { title: 'สถานะ', key: 'form_status', width: '150px' },
]

const subHeadersOnl = [
  { title: 'ลำดับ', key: 'rowIndex', width: '50px', align: 'start' },
  { title: 'ชื่อผู้เสนอ', key: 'user_fullname', width: '150px' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '180px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '80px' },
  { title: 'ISBN', key: 'ISBN', width: '80px' },
  { title: 'สถานะ', key: 'form_status', width: '80px' },
  { title: 'รายละเอียด', key: 'form_description', width: '120px' },
  { title: 'อีเมล', key: 'user_email', width: '120px' },
  { title: 'ตรวจสอบเมื่อ', key: 'updatedAt', width: '120px' },
  { title: 'ดำเนินการ', key: 'send', width: '150px' },
]

const subHeadersPriceOnl = [
  { title: 'ลำดับ', key: 'rowIndex', width: '50px', align: 'start' },
  { title: 'ชื่อผู้เสนอ', key: 'user_fullname', width: '150px' },
  { title: 'อีเมล', key: 'user_email', width: '120px' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '180px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '80px' },
  { title: 'ISBN', key: 'ISBN', width: '80px' },
  { title: 'สถานะ', key: 'form_status', width: '80px' },
  { title: 'ราคา', key: 'price', width: '100px' },
  { title: 'รายละเอียด', key: 'form_description', width: '120px' },
  { title: 'ตรวจสอบเมื่อ', key: 'updatedAt', width: '120px' },
  { title: 'ระบุราคา', key: 'specify', width: '150px' },
]

//เลือกตารางหลัก
const computedHeaders = computed(() => {
  // ตรวจสอบค่าของ selectedStatus และ selectedCategory
  if (selectedCategory.value === 'เสนอหนังสือทั่วไป') {
    if (selectedStatus.value === 'กำลังดำเนินการ') {
      return formOnl // ใช้ headers สำหรับ 'กำลังดำเนินการ'
    } else if (selectedStatus.value === 'อนุมัติการซื้อ') {
      return formOnlprice // ใช้ headers สำหรับ 'อนุมัติการซื้อ'
    } else if (selectedStatus.value === 'สถานะการอนุมัติ') {
      return formOnlstatus // ใช้ headers สำหรับ 'ไม่อนุมัติการซื้อ'
    }
  }
  return formOnl // ค่าเริ่มต้น
})

//เลือกตารางแทรก
const computedSubHeaders = computed(() => {
  if (selectedCategory.value === 'เสนอหนังสือทั่วไป' && selectedStatus.value === 'อนุมัติการซื้อ') {
    return subHeadersPriceOnl // ใช้ subHeadersPriceOnl สำหรับ formOnlprice
  }
  return subHeadersOnl // ค่าเริ่มต้น
})

// 📌 Headers สำหรับ "เสนอหนังสืองานหนังสือ"
const formOfl = [
  { title: 'ลำดับ', key: 'rowIndex', width: '50px', align: 'start' },
  { title: 'ชื่อผู้เสนอ', key: 'user_fullname', width: '150px' },
  { title: 'อีเมล', key: 'user_email', width: '120px' },
  { title: 'ร้านค้า', key: 'store_name', width: '180px' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '200px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '100px' },
  { title: 'ISBN', key: 'ISBN', width: '100px' },
  { title: 'ราคา', key: 'book_price', width: '100px' },
  { title: 'รายละเอียด', key: 'form_description', width: '150px' },
  { title: 'รูปภาพ', key: 'image', align: 'center' },
  { title: 'ตรวจหนังสือ', key: 'check', width: '150px' },
  { title: 'ดำเนินการ', key: 'send', width: '150px' },
]

const subHeadersOfl = [
  { title: 'ลำดับ', key: 'rowIndex', width: '50px', align: 'start' },
  { title: 'ชื่อผู้เสนอ', key: 'user_fullname', width: '150px' },
  { title: 'อีเมล', key: 'user_email', width: '120px' },
  { title: 'ร้านค้า', key: 'store_name', width: '180px' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '200px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '100px' },
  { title: 'ISBN', key: 'ISBN', width: '100px' },
  { title: 'ราคา', key: 'book_price', width: '100px' },
  { title: 'รายละเอียด', key: 'form_description', width: '150px' },
  { title: 'รูปภาพ', key: 'image', align: 'center' },
  { title: 'ตรวจสอบเมื่อ', key: 'updatedAt', width: '120px' },
  { title: 'ดำเนินการ', key: 'send', width: '150px' },
]

const onFilter = (newStatus) => {
  selectedStatus.value = newStatus
}

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const itemDate = new Date(item.createdAt)
    const selectedDateFormatted = new Date(selectedDate.value)

    return (
      item.book_category === selectedCategory.value &&
      itemDate.toLocaleDateString('th-TH') === selectedDateFormatted.toLocaleDateString('th-TH') &&
      (selectedStatus.value === '' || // ถ้าไม่ได้เลือกสถานะให้กรองหมด
        item.form_status === selectedStatus.value || // กรองตามสถานะที่เลือก
        (selectedStatus.value === 'สถานะการอนุมัติ' &&
          ['อนุมัติการซื้อ', 'ไม่อนุมัติการซื้อ'].includes(item.form_status))) // กรณีที่เลือก "สถานะการอนุมัติ" ให้แสดงทั้งสองสถานะ
    )
  })
})

// ฟังก์ชันที่ดึงข้อมูล
const fetchData = async () => {
  loading.value = true
  try {
    const urls = [
      { url: 'http://bookfair.buu.in.th:8043/offer-forms-onl', category: 'เสนอหนังสือทั่วไป' },
      { url: 'http://bookfair.buu.in.th:8043/offer-forms-ofl', category: 'เสนอหนังสืองานหนังสือ' },
    ]

    const responses = await Promise.all(urls.map(({ url }) => axios.get(url)))

    // อัพเดตข้อมูล items
    items.value = responses.flatMap((response, index) => {
      const data = Array.isArray(response.data) ? response.data : []
      return data.map((item) => {
        const user = item.user
        const library = item.library
        const faculty = item.faculty
        const department = item.department
        const teacher = item.user.teacher

        console.log('Item data:', item) // เพิ่มการ log ข้อมูลที่ได้รับจาก API

        return {
          offer_form_id: item.offerForms_onl_id || item.offerForms_ofl_id || '-',
          user_fullname: item.user_name || '-',
          role_offer: item.role_offer || '-',
          faculty_name: faculty?.faculty_name || '-',
          department_name: department?.department_name || '-',
          user_email: item.user_email || '-',
          user_tel: item.user_tel || '-',
          ISBN: item.ISBN || '-',
          book_title: item.book_title || '-',
          book_author: item.book_author || '-',
          book_course: item.book_course || '-',
          price: item.price ?? '-',
          form_status: item.status || '-',
          form_description: item.form_description || '-',
          createdAt: item.createdAt || '', // ดึงข้อมูลวันที่สร้าง
          user_id: user?.user_id || '-',
          library_id: library?.library_id || '-',
          faculty_id: faculty?.faculty_id || '-',
          department_id: department?.department_id || '-',
          book_category: urls[index].category,
          image: item.image || null,
          check: '🔍 ตรวจสอบ',
          view: '📄 ดูรายละเอียด',
          budget_amount: library?.budget_amount || '0',
          budget_remain: library?.budget_remain || '0',
          budget_year: library?.budget_year || '-',
          faculty_e_coupon: faculty?.e_coupon || '0',
          department_e_coupon: department?.e_coupon || '0',
          user_e_coupon: teacher?.e_coupon || '-',
          user_id: teacher?.teacher_id || '-',
        }
      })
    })
  } catch (error) {
    console.error('🚨 ดึงข้อมูลล้มเหลว:', error)
  } finally {
    loading.value = false
  }
}

// ฟังก์ชันเปิด dialog และตั้งค่า selectedItem
const openDialog = (item) => {
  selectedItem.value = item // กำหนด selectedItem ให้เป็นข้อมูลของ item ที่เลือก
  confirmDialog.value = true // เปิด dialog
}

// ฟังก์ชันที่จะเรียกใช้เมื่อเลือก "ไม่อนุมัติการซื้อ"
const rejectPurchase = () => {
  updateStatus('ไม่อนุมัติการซื้อ')
}

// ฟังก์ชันที่จะเรียกใช้เมื่อเลือก "อนุมัติการซื้อ"
const approvePurchase = () => {
  updateStatus('อนุมัติการซื้อ')
}

// ฟังก์ชันอัพเดตค่า status ของ selectedItem ผ่าน API
const updateStatus = async (status) => {
  if (selectedItem.value && selectedItem.value.offer_form_id) {
    try {
      // ส่ง request ไปยัง API ด้วย axios
      await axios.patch(
        `http://bookfair.buu.in.th:8043/offer-forms-onl/${selectedItem.value.offer_form_id}`,
        {
          status: status, // ส่ง status ที่อัพเดต
        },
      )

      // อัพเดต status ใน selectedItem หลังจากทำการ update
      selectedItem.value.form_status = status

      // ปิด dialog
      confirmDialog.value = false

      // แสดง dialog "ดำเนินการเสร็จสิ้น"
      completeDialog.value = true

      // เรียกฟังก์ชัน fetchData เพื่อดึงข้อมูลใหม่
      await fetchData()
    } catch (error) {
      console.error('Error updating status:', error)
      // แจ้งเตือนเมื่อเกิดข้อผิดพลาดในการอัพเดต
      alert('เกิดข้อผิดพลาดในการอัพเดตสถานะ')
    }
  }
}

// ฟังก์ชันเปิด dialog สำหรับกรอกราคา
const openPriceDialog = (item) => {
  selectedItem.value = item // เก็บ item ที่ต้องการอัพเดต
  priceInput.value = item.price // กำหนดค่า default เป็นราคาปัจจุบัน
  priceDialog.value = true // เปิด dialog
}

const fundingSources = computed(() => [
  {
    key: 'library',
    name: 'หอสมุด',
    amount: selectedItem.value?.budget_remain ?? 0,
  },
  {
    key: 'faculty',
    name: 'คณะ',
    amount: selectedItem.value?.faculty_e_coupon ?? 0,
  },
  {
    key: 'department',
    name: 'สาขา',
    amount: selectedItem.value?.department_e_coupon ?? 0,
  },
  {
    key: 'offer',
    name: 'ผู้เสนอ',
    amount: selectedItem.value?.user_e_coupon ?? 0,
  },
])

// คำนวณยอดเงินรวมจากแหล่งที่เลือก
const totalSelectedAmount = computed(() => {
  if (!selectedSource.value || !Array.isArray(fundingSources.value)) {
    return 0 // ถ้ายังไม่ได้เลือกแหล่งหักเงิน หรือ fundingSources ไม่ใช่อาเรย์
  }
  const selected = fundingSources.value.find((source) => source.key === selectedSource.value)
  return selected ? selected.amount : 0
})

// ฟังก์ชันอัพเดตราคา
const updatePrice = async () => {
  if (selectedItem.value && selectedItem.value.offer_form_id) {
    if (totalSelectedAmount.value < priceInput.value) {
      alert('เงินไม่พอสำหรับการหักราคา')
      return
    }

    try {
      console.log('--- เริ่มกระบวนการอัพเดตราคา ---')
      console.log('Selected Source:', selectedSource.value)
      console.log('Selected Item:', selectedItem.value)
      console.log('Price Input:', priceInput.value)

      // ตรวจสอบแหล่งหักเงินที่เลือก
      const updatePromises = []

      // ตรวจสอบค่า
      console.log('Selected Source value:', selectedSource.value)
      console.log('selectedItem.value.library:', selectedItem.value.library_id)
      console.log('selectedItem.value.faculty:', selectedItem.value.faculty_id)
      console.log('selectedItem.value.department:', selectedItem.value.department_id)
      console.log('selectedItem.value.user:', selectedItem.value.user_id)

      // ตรวจสอบค่าในแต่ละแหล่งหักเงิน
      if (selectedSource.value === 'library' && selectedItem.value.library_id) {
        console.log('[Library] Before Update:', selectedItem.value.library_id)
        const newBudget = selectedItem.value.budget_remain - priceInput.value
        console.log(
          `[Library] ID: ${selectedItem.value.library_id}, Budget Before: ${selectedItem.value.budget_remain}, After: ${newBudget}`,
        )

        updatePromises.push(
          axios
            .patch(`http://bookfair.buu.in.th:8043/library/${selectedItem.value.library_id}`, {
              budget_remain: newBudget,
            })
            .then((response) => {
              console.log(`✅ Library API Response:`, response.data)
            })
            .catch((error) => {
              console.error(`❌ Library API Error:`, error)
            }),
        )
      }

      if (selectedSource.value === 'faculty' && selectedItem.value.faculty_id) {
        console.log('[Faculty] Before Update:', selectedItem.value.faculty_id)
        const newECoupon = selectedItem.value.faculty_e_coupon - priceInput.value
        console.log(
          `[Faculty] ID: ${selectedItem.value.faculty_id}, eCoupon Before: ${selectedItem.value.faculty_e_coupon}, After: ${newECoupon}`,
        )

        updatePromises.push(
          axios
            .patch(`http://bookfair.buu.in.th:8043/faculties/${selectedItem.value.faculty_id}`, {
              e_coupon: newECoupon,
            })
            .then((response) => {
              console.log(`✅ Faculty API Response:`, response.data)
            })
            .catch((error) => {
              console.error(`❌ Faculty API Error:`, error)
            }),
        )
      }

      if (selectedSource.value === 'department' && selectedItem.value.department_id) {
        console.log('[Department] Before Update:', selectedItem.value.department_id)
        const newECoupon = selectedItem.value.department_e_coupon - priceInput.value
        console.log(
          `[Department] ID: ${selectedItem.value.department_id}, eCoupon Before: ${selectedItem.value.department_e_coupon}, After: ${newECoupon}`,
        )

        updatePromises.push(
          axios
            .patch(
              `http://bookfair.buu.in.th:8043/departments/${selectedItem.value.department_id}`,
              {
                e_coupon: newECoupon,
              },
            )
            .then((response) => {
              console.log(`✅ Department API Response:`, response.data)
            })
            .catch((error) => {
              console.error(`❌ Department API Error:`, error)
            }),
        )
      }

      if (selectedSource.value === 'offer' && selectedItem.value.user_id) {
        console.log('[Offer] Before Update:', selectedItem.value.user_id)
        const newECoupon = selectedItem.value.user_e_coupon - priceInput.value
        console.log(
          `[Offer] ID: ${selectedItem.value.user_id}, eCoupon Before: ${selectedItem.value.user_e_coupon}, After: ${newECoupon}`,
        )

        updatePromises.push(
          axios
            .patch(`http://bookfair.buu.in.th:8043/teachers/${selectedItem.value.user_id}`, {
              e_coupon: newECoupon,
            })
            .then((response) => {
              console.log(`✅ Offer API Response:`, response.data)
            })
            .catch((error) => {
              console.error(`❌ Offer API Error:`, error)
            }),
        )

        if (!selectedSource.value) {
          alert('กรุณาเลือกแหล่งหักเงิน')
          return
        }
      }

      console.log('--- ส่ง API Request เพื่ออัพเดต Budget/eCoupon ---')
      await Promise.all(updatePromises)
      console.log('✅ การอัพเดต Budget/eCoupon เสร็จสิ้น')

      console.log(`--- อัพเดตราคา Offer Form ID: ${selectedItem.value.offer_form_id} ---`)
      await axios.patch(
        `http://bookfair.buu.in.th:8043/offer-forms-onl/${selectedItem.value.offer_form_id}`,
        {
          price: priceInput.value,
        },
      )
      console.log('✅ อัพเดตราคาเรียบร้อย')

      // อัพเดตราคาใน selectedItem
      selectedItem.value.price = priceInput.value

      // ปิด dialog
      priceDialog.value = false

      // แสดง dialog "ดำเนินการเสร็จสิ้น"
      completeDialog.value = true

      console.log('📡 Fetching Data ใหม่...')
      await fetchData()
      console.log('✅ ดึงข้อมูลใหม่เสร็จสิ้น:', selectedItem.value)
    } catch (error) {
      console.error('❌ Error updating price:', error)
      alert('เกิดข้อผิดพลาดในการอัพเดตราคา')
    }
  }
}

onMounted(() => {
  fetchData() // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล
  selectedDate.value = new Date()
})

// โค้ดที่ยังไม่ใช้งาน
// ฟังก์ชันการกรองรายการซ้ำ
// const getDuplicateItems = (item) => {
//   if (!item || !item.ISBN) {
//     console.warn('⚠️ ไม่มีข้อมูล item หรือ ISBN')
//     return []
//   }

//   const normalizedItemISBN = cleanISBN(item.ISBN)
//   const duplicates = booksData.value.filter((selectedItem) => {
//     const normalizedSelectedISBN = cleanISBN(selectedItem.ISBN)
//     return (
//       normalizedSelectedISBN === normalizedItemISBN &&
//       selectedItem.offer_form_id !== item.offer_form_id
//     )
//   })
//   return duplicates // คืนค่ารายการซ้ำทั้งหมด
// }

// // ฟังก์ชันตรวจสอบและอัปเดตสถานะ
// const onCheckClick = async (item) => {
//   console.log('Selected Item:', item)

//   if (!item.offer_form_id) {
//     console.error('Missing offer_form_id in item:', item)
//     return
//   }

//   selectedItem.value = item
//   updateDateTime()

//   try {
//     await updateApproveStatus(item)
//     confirmDialog.value = true // เปิด Confirm Dialog
//   } catch (error) {
//     console.error('Error updating approve status and duplicate_check:', error)
//   }
// }

// // ฟังก์ชันเปิดการส่งข้อความ
// const onMessageClick = (item) => {
//   selectedItem.value = item
//   messageDialog.value = true // เปิด Message Dialog
// }

// ฟังก์ชันแสดงวันที่เวลาที่ตรวจสอบ
const getCheckedTimestamp = (item) => {
  if (!checkedTimestamps.value[item.ISBN]) {
    checkedTimestamps.value[item.ISBN] = new Date()
      .toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', ' เวลา')
  }
  return checkedTimestamps.value[item.ISBN]
}

//ปุ่มเปิดตาราง subHeadersOnl
const toggleExpandTimeMap = new Map<string, string>() // ✅ เก็บค่าเวลาของแต่ละ ISBN

const toggleExpand = async (item) => {
  console.log('📌 กดตรวจสอบรายการ:', item) // Log รายการที่ถูกกด
  if (!item.ISBN) {
    console.warn('❗ ไม่มี ISBN ไม่สามารถตรวจสอบได้')
    return
  }

  const normalizedISBN = cleanISBN(item.ISBN)
  const localStorageKey = `toggleExpandTime_${normalizedISBN}`

  let savedTime = localStorage.getItem(localStorageKey)

  if (!savedTime) {
    savedTime = new Date()
      .toLocaleString('th-TH', {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(',', ' เวลา')

    localStorage.setItem(localStorageKey, savedTime)
  }

  console.log('🕒 เวลาที่ใช้แสดง:', savedTime)

  const apiUrl = 'http://bookfair.buu.in.th:8043/offer-forms-onl'
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    console.log('📌 ข้อมูลทั้งหมดจาก API:', data)

    // กรองรายการซ้ำ โดยไม่ให้ offer_form_id ซ้ำกับ item และให้ ISBN ตรงกัน
    duplicateItems.value = data
      .map((book) => ({
        ...book,
        offer_form_id: book.offerForms_onl_id, // ทำให้คีย์ตรงกัน
      }))
      .filter((book) => {
        const isSameISBN = cleanISBN(book.ISBN) === normalizedISBN
        const isDifferentOffer =
          book.offer_form_id?.toString().trim() !== item.offer_form_id?.toString().trim()

        return isSameISBN && isDifferentOffer
      })
      .map((book) => ({
        ...book,
        toggleExpandTime: savedTime,
      }))

    console.log('📌 duplicateItems (หลังกรอง):', duplicateItems.value)

    console.log('📌 duplicateItems (หลังกรอง):', duplicateItems.value)

    console.log('📌 duplicateItems (หลังกรอง):', duplicateItems.value)

    // แสดงหรือซ่อนตารางแทรก
    if (expandedItems.value.includes(item.offer_form_id)) {
      expandedItems.value = expandedItems.value.filter((id) => id !== item.offer_form_id)
    } else {
      expandedItems.value = [item.offer_form_id]
    }
  } catch (error) {
    console.error('⚠️ เกิดข้อผิดพลาดในการตรวจสอบ ISBN:', error)
  }
}

const cleanISBN = (isbn) => {
  return isbn?.replace(/\D/g, '') || '' // ลบอักขระที่ไม่ใช่ตัวเลข และป้องกันกรณี ISBN เป็น undefined
}
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
  max-width: 350px;
}

.custom-select {
  font-size: 12px !important; /* ขนาดตัวอักษรใน input */
  height: 36px !important;
  line-height: 1 !important;
}

.active-tab {
  background-color: #d1bb9e !important; /* เปลี่ยนสีพื้นหลัง */
  border: 2px solid #a79277 !important; /* เพิ่มกรอบ */
  border-radius: 8px; /* ทำให้มุมมน */
  color: #503c3c !important; /* เปลี่ยนสีตัวอักษร */
  margin: 0 8px;
}

.inactive-tab {
  background-color: #c2c2c2 !important; /* สีพื้นหลังของแท็บที่ยังไม่ถูกเลือก */
  border: 2px solid #d3d3d3 !important; /* กรอบสีเทา */
  border-radius: 8px; /* มุมมน */
  color: #888 !important; /* สีตัวอักษรที่ดูจางลง */
  margin: 0 8px;
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

.highlight-row {
  background-color: rgba(255, 0, 0, 0.2); /* สีแดงอ่อน */
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.table-cell {
  min-width: 100px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.duplicate-row {
  background-color: #ffeb99 !important; /* สีเหลืองอ่อน */
}

.status-pending {
  color: #9e6511; /* สีเหลือง */
  font-weight: bold;
}

.status-approved {
  color: #3e8040; /* สีเขียว */
  font-weight: bold;
}

.status-rejected {
  color: #b8453d; /* สีแดง */
  font-weight: bold;
}
</style>
