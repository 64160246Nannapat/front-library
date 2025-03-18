<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container fluid>

      <!-- Data Table Section -->
      <v-data-table
        v-model:expanded="expandedItems"
        :headers="headers"
        :items="filteredItems"
        :items-length="totalItems"
        :loading="loading"
        item-value="offer_form_id"
        :hide-default-footer="true"
        class="custom-table no-scrollbar"
        style="width: 100%; table-layout: fixed; border-collapse: collapse"
        item-class="getRowClass"
        fixed-header
      >
        <!--:header-props="{ style: 'background-color: #d3d3d3; color: black' }"-->
        <!-- หัวข้อคอลัมน์ของตารางหลัก -->
        <template #item.rowIndex="{ index }">
          <div style="text-align: left">{{ index + 1 }}</div>
        </template>

        <template #item.user_fullname="{ item }">
          <div style="text-align: left">{{ item.user_fullname }}</div>
        </template>

        <template #item.store_name="{ item }">
          <div style="text-align: left">{{ item.store?.store_name || '-' }}</div>
        </template>

        <template #item.book_title="{ item }">
          <div style="text-align: left">{{ item.book_title }}</div>
        </template>

        <template #item.book_author="{ item }">
          <div style="text-align: left">{{ item.book_author }}</div>
        </template>

        <template #item.published_year="{ item }">
          <div style="text-align: left">{{ item.published_year }}</div>
        </template>

        <template #item.ISBN="{ item }">
          <div style="text-align: left">
            <span :class="{ 'text-danger': hasDuplicateISBN(item.ISBN) }">
              {{ item.ISBN }}
            </span>
          </div>
        </template>

        <template #item.book_price="{ item }">
          <div style="min-width: 60px; text-align: left">{{ item.book_price }}</div>
        </template>

        <template #item.book_quantity="{ item }">
          <div style="min-width: 60px; text-align: left">{{ item.book_quantity }}</div>
        </template>

        <template #item.form_status="{ item }">
          <div style="min-width: 120px; text-align: left">{{ item.form_status }}</div>
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

        <!--ปุ่มตารางหลัก-->
        <!-- ฟังก์ชันที่ทำการตรวจสอบ ISBN -->
        <template #item.check="{ item }">
          <v-btn
            :style="{ backgroundColor: '#CAA6A6', color: '#944E63' }"
            @click="toggleExpand(item)"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>

        <template #item.view="{ item }">
          <div class="d-flex">
            <v-btn
              :style="{ backgroundColor: '#AAB99A', color: '#727D73' }"
              :disabled="!item.offer_form_id"
              @click="onCheckClick(item)"
            >
              <v-icon left style="margin-right: 5px; font-size: 25px">mdi-list-status</v-icon>
            </v-btn>
          </div>
        </template>

        <template #item.email="{ item }">
          <div class="d-flex">
            <v-btn
              :style="{ backgroundColor: '#889EAF', color: '#506D84' }"
              :disabled="!item.offer_form_id"
              @click="onMessageClick(item)"
            >
              <v-icon left style="margin-right: 5px; font-size: 25px">mdi-email-outline</v-icon>
            </v-btn>
          </div>
        </template>

        <!-- ตารางแทรก -->
        <template #expanded-row="{ item }">
          <tr v-if="expandedItems[0] === item.offer_form_id">
            <td :colspan="headers.length + 1" style="padding: 0">
              <v-container fluid>
                <v-data-table
                  v-if="getDuplicateItems(item).length > 0"
                  :headers="subHeaders"
                  :items="getDuplicateItems(item)"
                  item-value="offer_form_id"
                  class="custom-table no-scrollbar"
                  style="
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                    background-color: #f5f5f5;
                  "
                  :hide-default-footer="true"
                  fixed-header
                  :header-props="{ style: 'background-color: #DCD7C9; color: black' }"
                >
                  <!-- Slot sub table -->
                  <template v-slot:item.user_fullname="{ item }">
                    <span>{{ item.user_fullname || '-' }}</span>
                  </template>
                  <template v-slot:item.store.store_name="{ item }">
                    <span>{{ item.store?.store_name || '-' }}</span>
                  </template>
                  <template v-slot:item.duplicate_status="{ item }">
                    <span style="color: red; font-weight: bold">เสนอซ้ำ</span>
                  </template>
                  <template v-slot:item.view="{ item }">
                    <div style="text-align: center">
                      <v-btn
                        :style="{ backgroundColor: '#AAB99A', color: '#727D73' }"
                        @click="onCheckClick(item)"
                      >
                        <v-icon left style="margin-right: 5px; font-size: 25px">
                          mdi-list-status
                        </v-icon>
                      </v-btn>
                    </div>
                  </template>

                  <template #item.email="{ item }">
                    <div class="d-flex">
                      <v-btn
                        :style="{ backgroundColor: '#889EAF', color: '#506D84' }"
                        :disabled="!item.offer_form_id"
                        @click="onMessageClick(item)"
                      >
                        <v-icon left style="margin-right: 5px; font-size: 25px"
                          >mdi-email-outline</v-icon
                        >
                      </v-btn>
                    </div>
                  </template>

                  <!--ตรวจเมื่อ-->
                  <template v-slot:item.checked_time="{ item }">
                    <span>{{ getCheckedTimestamp(item) }}</span>
                  </template>
                </v-data-table>
                <div v-else style="text-align: center; padding: 20px; color: grey">
                  ไม่มีรายการหนังสือซ้ำ
                </div>
              </v-container>
            </td>
          </tr>
        </template>

        <!-- <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <v-data-table
                  v-if="getBooksByISBN(item.ISBN).length > 0"
                  :headers="subNoImageHeaders"
                  :items="getBooksByISBN(item.ISBN)"
                  item-value="ISBN"
                  dense
                  class="nested-table"
                >
                  <template #item.user_fullname="{ item }">
                    {{ item.user_fullname }}
                  </template>
                  <template #item.store_name="{ item }">
                    {{ item.store_name }}
                  </template>
                  <template #item.book_title="{ item }">
                    {{ item.book_title }}
                  </template>
                  <template #item.book_author="{ item }">
                    {{ item.book_author }}
                  </template>
                  <template #item.published_year="{ item }">
                    {{ item.published_year }}
                  </template>
                  <template #item.ISBN="{ item }">
                    {{ item.ISBN }}
                  </template>
                  <template #item.book_price="{ item }">
                    {{ item.book_price }}
                  </template>
                  <template #item.book_quantity="{ item }">
                    {{ item.book_quantity }}
                  </template>
                </v-data-table>
              </td>
            </tr>
          </template> -->
      </v-data-table>

      <v-dialog v-model="dialogSuccess" width="90%" max-width="1530px">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>ข้อมูลหนังสือ</span>
            <span class="checked-date-time" style="font-size: 12px">
              ตรวจสอบไปเมื่อ: {{ checkedDateTimeMap[selectedISBN] || 'ยังไม่มีข้อมูล' }}
            </span>
          </v-card-title>
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
                <p><strong>งบประมาณคณะคงเหลือ:</strong></p>
              </v-col>
              <v-col cols="6">
                <p><strong>งบประมาณสาขาคงเหลือ:</strong></p>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>
            <p><strong>ชื่อผู้เสนอ:</strong> {{ selectedItem?.user_fullname || 'ไม่ระบุ' }}</p>
            <p><strong>คณะ:</strong> {{ selectedItem?.faculty?.faculty_name || 'ไม่ระบุ' }}</p>
            <p>
              <strong>สาขา:</strong> {{ selectedItem?.department?.department_name || 'ไม่ระบุ' }}
            </p>
            <p><strong>ชื่อหนังสือ:</strong> {{ selectedItem?.book_title }}</p>
            <p><strong>ISBN:</strong> {{ selectedItem?.ISBN }}</p>
            <p><strong>ราคา:</strong> {{ selectedItem?.book_price }} บาท</p>
            <p><strong>จำนวน:</strong> {{ selectedItem?.book_quantity }} เล่ม</p>
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

      <!-- Message Dialog -->
      <v-dialog v-model="messageDialog" max-width="800">
        <v-card style="background-color: #ede8dc">
          <!-- Header with rounded corners -->
          <div
            style="
              background-color: #c39898;
              padding: 16px;
              border-top-left-radius: 0px; /* ไม่มีความมนที่มุมบนซ้าย */
              border-top-right-radius: 0px; /* ไม่มีความมนที่มุมบนขวา */
              border-bottom-left-radius: 16px; /* ความมนที่มุมล่างซ้าย */
              border-bottom-right-radius: 16px; /* ความมนที่มุมล่างขวา */
            "
          >
            <v-card-title style="font-weight: bold"
              >ส่ง: {{ selectedItem?.user_fullname || 'ไม่ระบุ' }}</v-card-title
            >
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
import { ref, computed, onMounted, watch, reactive } from 'vue'
import defaultImage from '@/assets/front-book.png'
import backImage from '@/assets/back-book.png'
import axios from 'axios'

// Date & Search Variables
const selectedDate = ref(new Date())
const menuDate = ref(false)
const dialogSuccess = ref(false)
const searchBook = ref('เสนอหนังสือทั่วไป')
const selectedTab = ref('กำลังดำเนินการ')
const loading = ref(false)
const dialog = ref(false)
const selectedBookImage = ref('ไม่มีรูปภาพ')
const totalItems = ref(0)
const serverItems = ref<BookItem[]>([])
const fullDate = ref(new Date().toLocaleDateString()) // วันที่ปัจจุบัน
const fullTime = ref(new Date().toLocaleTimeString()) // เวลาปัจจุบัน
const itemsPerPage = ref(1000000)
const noDataMessage = ref('')
const selectedISBN = ref('')
const selectedCreatedAt = ref('')
const selectedPrice = ref(0)
const dialogImage = ref(false)
const selectedImage = ref('')
const messageDialog = ref(false)
const confirmDialog = ref(false)
const selectedItem = ref(null)
const selectedItems = ref([])
const message = ref('')
const activeTab = ref('duplicate')
const offerForms = ref([])
const items = ref([])
const expandedItems = ref([])
const booksData = ref<BookItem[]>([])
const checkedTimestamps = ref<{ [key: string]: string }>({}) // เก็บค่า timestamp

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
  { title: 'ลำดับ', key: 'rowIndex', width: '50px', align: 'start' },
  { title: 'ข้อมูลผู้คัดเลือก', key: 'user_fullname', width: '150px' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '200px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '100px' },
  { title: 'ปีพิมพ์', key: 'published_year', width: '60px' },
  { title: 'ISBN', key: 'ISBN', width: '100px' },
  { title: 'ราคาสุทธิ', key: 'price', width: '60px' },
  { title: 'ดำเนินการ', key: 'form_status', width: '120px' },
  { title: 'รายละเอียด', key: 'form_description', width: '150px' },
  { title: 'E-mail', key: 'user_email', width: '120px' },
]

const subHeaders = [
  { title: 'ข้อมูลผู้คัดเลือก', key: 'user_fullname', width: '120px' },
  { title: 'ชื่อหนังสือ', key: 'book_title', width: '180px' },
  { title: 'ผู้แต่ง', key: 'book_author', width: '80px' },
  { title: 'ปีพิมพ์', key: 'published_year', width: '60px' },
  { title: 'ISBN', key: 'ISBN', width: '80px' },
  { title: 'สถานะ', key: 'form_status', width: '80px' },
  { title: 'รายละเอียด', key: 'form_description', width: '120px' },
  { title: 'E-mail', key: 'user_email', width: '120px' },
  { title: 'ตรวจสอบเมื่อ', key: 'updatedAt', width: '120px' },
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
  { title: 'E-mail', key: 'email' },
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
  const baseHeaders = searchBook.value === 'เสนอหนังสือทั่วไป' ? NoImageHeaders : ImageHeaders

  if (selectedTab.value === 'ไม่อนุมัติการซื้อ' || selectedTab.value === 'อนุมัติการซื้อ') {
    return baseHeaders.map((header) =>
      header.key === 'view' ? { ...header, title: 'สถานะ', key: 'form_status' } : header,
    )
  }

  return baseHeaders
})

const filteredItems = computed(() => {
  return serverItems.value
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

const closeMenu = () => {
  //ทำการปิดปฎิทิน
  menuDate.value = false
}

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
        selectedTab.value === 'ไม่อนุมัติการซื้อ' || selectedTab.value === 'อนุมัติการซื้อ'
          ? new Date(item.updatedAt) // ถ้าเป็นให้ใช้ updatedAt
          : new Date(item.createdAt) // ถ้าไม่ใช่ให้ใช้ createdAt

      return dateToCompare >= startOfDay && dateToCompare <= endOfDay
    })
    .map((item, index) => ({
      ...item,
      rowIndex: index + 1, // เพิ่มลำดับแถว
    }))
}

//เวลาตรวจสอบเมื่อ ในตารางแทรก
const getCheckedTimestamp = (item) => {
  if (!checkedTimestamps.value[item.ISBN]) {
    checkedTimestamps.value[item.ISBN] = new Date()
      .toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short', // ✅ แสดงเดือนแบบย่อ
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', ' เวลา') // ✅ แทรกคำว่า "เวลา" ระหว่างวันที่และเวลา
  }
  return checkedTimestamps.value[item.ISBN]
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
    const urls = [
      { url: 'http://bookfair.buu.in.th:8043/offer-forms-onl', source: 'online' },
      { url: 'http://bookfair.buu.in.th:8043/offer-forms-ofl', source: 'offline' },
    ]

    const responses = await Promise.all(
      urls.map(({ url, source }) =>
        axios
          .get(url, { params: { page, itemsPerPage } })
          .then((res) => ({ data: res.data, source })),
      ),
    )

    const allItems = responses.flatMap(({ data, source }) =>
      data.map((item: any) => ({
        offer_form_id: item.offerForms_onl_id || item.offerForms_ofl_id,
        user_email: item.user_email,
        user_fullname: item.user_name,
        book_title: item.book_title,
        book_author: item.book_author,
        ISBN: item.ISBN,
        book_price: item.price || 0,
        book_quantity: item.book_quantity || 0,
        book_imgs: item.book_imgs || '',
        form_status: item.status || 'กำลังดำเนินการ',
        book_category: item.book_category || 'ไม่ระบุ',
        publisher: item.publisher || 'ไม่ระบุ',
        edition: item.edition || 'ไม่ระบุ',
        description: item.form_description || 'ไม่มีรายละเอียด',
        bookCover: item.bookCover || '',
        detail: item.detail || '',
        store: item.store || null,
        image: item.book_imgs || '',
        source, // ระบุว่าเป็นข้อมูลจากไหน (online / offline)
      })),
    )

    return {
      onlineBooks: allItems.filter((item) => item.source === 'online'),
      offlineBooks: allItems.filter((item) => item.source === 'offline'),
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { onlineBooks: [], offlineBooks: [] }
  }
}

const fetchOfferForms = async (page = 1) => {
  loading.value = true
  const { items } = await fetchDataFromAPI({ page, itemsPerPage })
  offerForms.value = items
  loading.value = false
}

const onCheckClick = async (item) => {
  console.log('Selected Item:', item) // ✅ ตรวจสอบข้อมูลที่ส่งมา

  if (!item.offer_form_id) {
    console.error('Missing offer_form_id in item:', item)
    return
  }

  selectedItem.value = item
  updateDateTime()

  try {
    await updateApproveStatus(item)
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

  const url = `http://bookfair.buu.in.th:8043/offer-forms-onl/${item.offer_form_id}`
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

  // ดึงข้อมูลจากทั้งสอง API
  const { items } = await fetchDataFromAPI({
    page: 1,
    itemsPerPage: itemsPerPage.value,
  })

  console.log('ข้อมูลจาก API:', items)

  // กรองข้อมูลตามวันที่
  let filteredItems = filterDataByDate(items, selectedDate.value)
  console.log('ข้อมูลหลังกรองวันที่:', filteredItems)

  // กรองข้อมูลตามสถานะ (status)
  filteredItems = filteredItems.filter((item) => item.form_status === selectedTab.value)
  console.log('ข้อมูลหลังกรอง status:', filteredItems)

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

const checkedDateTimeMap = ref<Record<string, string>>(
  JSON.parse(localStorage.getItem('checkedDateTimeMap') || '{}'),
)

// ตรวจสอบว่ามี ISBN ซ้ำหรือไม่
const hasDuplicateISBN = (isbn) => {
  const normalizedISBN = cleanISBN(isbn)
  return booksData.value.filter((book) => cleanISBN(book.ISBN) === normalizedISBN).length > 1
}

const cleanISBN = (isbn) => {
  if (!isbn) return ''
  return String(isbn)
    .trim()
    .replace(/[^0-9xX]/g, '') // ลบอักขระพิเศษ
}

const isDuplicateRow = (item) => {
  const duplicateItems = getDuplicateItems(item)
  return duplicateItems.length > 0 // ถ้ามีข้อมูลซ้ำอย่างน้อย 1 รายการ
}

//หาเฉพาะรายการซ้ำ (คืนค่าเป็น array ที่มีรายการซ้ำเพียงตัวแรก)
const getDuplicateItems = (item) => {
  if (!item || !item.ISBN) {
    console.warn('⚠️ ไม่มีข้อมูล item หรือ ISBN')
    return []
  }
  const normalizedItemISBN = cleanISBN(item.ISBN)
  const duplicate = booksData.value.find((selectedItem) => {
    const normalizedSelectedISBN = cleanISBN(selectedItem.ISBN)
    return (
      normalizedSelectedISBN === normalizedItemISBN &&
      selectedItem.offer_form_id !== item.offer_form_id
    )
  })
  return duplicate ? [duplicate] : []
}

// ทำการ เปิด/ปิด ตารางแทรก expanded rows (เก็บเฉพาะ offer_form_id ของรายการที่ถูกคลิก)
const toggleExpand = (item) => {
  if (expandedItems.value.includes(item.offer_form_id)) {
    expandedItems.value = []
    console.log('ปิด expanded row สำหรับ offer_form_id:', item.offer_form_id)
  } else {
    expandedItems.value = [item.offer_form_id]
    console.log('เปิด expanded row สำหรับ offer_form_id:', item.offer_form_id)
  }
}

// ฟังก์ชันที่แสดงข้อความเมื่อไม่มีรายการซ้ำ
const noDuplicatesMessages = reactive({}) // reactive ใช้เก็บข้อความเมื่อไม่มีรายการซ้ำ

// ปรับ ISBN ให้เป็นรูปแบบเดียวกัน
const normalizeISBN = (isbn) => {
  if (!isbn) return '' // ป้องกัน undefined
  return isbn
    .replace(/[^0-9xX]/g, '')
    .trim()
    .toLowerCase()
}

const openImageDialog = (imageUrl: string) => {
  selectedImage.value = imageUrl
  dialogImage.value = true
}

// ฟังก์ชันที่ใช้เปิด dialog
const onMessageClick = (item: any) => {
  selectedItem.value = item // เก็บข้อมูลที่ผู้ใช้เลือก
  messageDialog.value = true // เปิด dialog
}

// ฟังก์ชันที่ใช้ในการส่งข้อความ
const sendMessage = () => {
  console.log('ส่งข้อความ:', message.value) // แสดงข้อความที่ผู้ใช้กรอก
  messageDialog.value = false // ปิด dialog
  message.value = '' // เคลียร์ข้อความ
}

watch(
  booksData,
  (newVal) => {
    console.log('✅ อัปเดต booksData:', JSON.stringify(newVal, null, 2))
  },
  { deep: true },
)

watch(expandedItems, (newVal) => {
  console.log('🔄 Expanded Items:', newVal)
})

watch(booksData, (newVal) => {
  console.log('📚 Updated booksData:', newVal)
})

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

onMounted(async () => {
  try {
    // ดึงข้อมูลจาก API
    const response = await fetch('http://bookfair.buu.in.th:8043/offer-forms-onl')
    const data = await response.json()
    booksData.value = data
    console.log('📚 ดึงข้อมูลสำเร็จ:', booksData.value)

    // คัดกรองรายการที่ไม่ซ้ำกันในแต่ละวัน (แสดงเฉพาะรายการแรก)
    const uniqueBooks = []
    const duplicates = []

    booksData.value.forEach((item) => {
      if (!hasDuplicateISBN(item.ISBN)) {
        // ถ้าไม่ซ้ำให้เพิ่มเข้าใน uniqueBooks
        uniqueBooks.push(item)
      } else {
        // ถ้าซ้ำ ให้เพิ่มเข้าในรายการซ้ำ
        duplicates.push(item)
      }
    })

    // อัปเดต filteredItems สำหรับการแสดงในตารางหลัก
    filteredItems.value = uniqueBooks
    // อัปเดตรายการซ้ำสำหรับการแสดงในตารางแทรก
    expandedItems.value = duplicates
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูล:', error)
  }
})

onMounted(() => {
  // โหลดข้อมูลจาก localStorage (ถ้ามี)
  const storedCheckedDateTimeMap = localStorage.getItem('checkedDateTimeMap')
  if (storedCheckedDateTimeMap) {
    checkedDateTimeMap.value = JSON.parse(storedCheckedDateTimeMap)
  }

  fetchOfferForms() // ฟังก์ชันอื่นๆ ที่ต้องการเรียกตอน Mounted
})
</script>
