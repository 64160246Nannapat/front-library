<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container class="budget-summary-container" fluid>
      <!-- Header -->
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6">
          <v-row>
            <div class="header">
              <img class="header-image" src="@/assets/budget-color.png" alt="Budget Image" />
              <h1 style="font-size: 25px">จัดการงบประมาณ</h1>
            </div>
          </v-row>
        </v-col>

        <v-row class="mb-6">
          <v-col cols="12">
            <v-card style="background-color: #ede8dc; border-radius: 16px">
              <v-card-title class="text-overline d-flex justify-space-between">
                <span style="font-size: 20px; font-weight: bold">งบประมาณคงเหลือ</span>
                <span class="text-h6 text-medium-emphasis font-weight-regular">
                  {{ formattedRemainingBudget }} บาท
                </span>
              </v-card-title>

              <v-card-text>
                <!-- หลอดทั้งหมด -->
                <div class="progress-container" style="position: relative; height: 18px">
                  <!-- หลอดเป้าหมาย -->
                  <v-progress-linear
                    :value="100"
                    height="18"
                    color="#e0e0e0"
                    rounded
                    style="width: 100%"
                  ></v-progress-linear>

                  <!-- หลอดดำเนินการ (ความคืบหน้า) -->
                  <v-progress-linear
                    v-model="animatedProgressValue"
                    height="18"
                    :color="totalBudget > 0 ? getProgressColor(animatedProgressValue) : 'grey'"
                    rounded
                    style="
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      transition: width 0.6s ease-in-out;
                    "
                  ></v-progress-linear>
                </div>

                <div class="d-flex justify-space-between py-3">
                  <span class="text-medium-emphasis"
                    >ใช้ไป: {{ formattedTotalUsedBudget }} บาท</span
                  >
                  <span class="text-medium-emphasis">
                    งบประมาณรวม: {{ formattedTotalBudget }} บาท
                  </span>
                </div>
              </v-card-text>

              <v-divider></v-divider>
            </v-card>
          </v-col>
        </v-row>
      </v-row>

      <!-- Dropdown ปี -->
      <v-row align="center" justify="start" style="margin-top: 5px; margin-bottom: 5px">
        <v-col cols="auto" class="d-flex justify-start align-center">
          <v-select
            v-model="selectedYear"
            :items="years"
            hide-details
            rounded="lg"
            variant="outlined"
            style="width: 120px; background-color: #fcdc94; border-radius: 10px"
            :menu-props="{ maxHeight: '300' }"
            @change="onYearChange"
          ></v-select>
        </v-col>

        <v-row justify="end">
          <v-col class="d-flex justify-end">
            <v-btn
              style="background-color: #fcdc94; width: 40px; height: 40px; margin-right: 8px"
              @click="onClickAdd"
            >
              <v-icon style="font-size: 30px">mdi-plus</v-icon>
            </v-btn>

            <v-btn
              style="background-color: #fcdc94; width: 40px; height: 40px; margin-right: 8px"
              @click="onClickAddMoney"
              :disabled="isButtonLocked"
            >
              <v-icon style="font-size: 40px">mdi-cash</v-icon>
            </v-btn>
            <v-btn
              style="background-color: #fcdc94; width: 20px; height: 40px; margin-right: 15px"
              @click="onClickFile"
            >
              <v-icon style="font-size: 30px">mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-row>

      <!-- ตารางข้อมูล -->
      <v-data-table
        v-model:expanded="expanded"
        :headers="headers"
        :items="filteredItems"
        item-value="id"
        show-expand
        class="budget-table"
        :hide-default-footer="true"
        :items-per-page="-1"
        dense
        fixed-header
        height="auto"
        style="width: 100%; table-layout: fixed"
      >
        <template v-slot:item="{ item, index }">
          <tr>
            <td :style="{ textAlign: 'start', width: '10%' }">{{ index + 1 }}</td>
            <td :style="{ textAlign: 'left', width: '50%', whiteSpace: 'nowrap' }">
              {{ item.faculty }}
            </td>
            <td :style="{ textAlign: 'right', width: '50%' }">
              <!-- ถ้า item.editing เป็น true จะมีช่องกรอก -->
              <v-text-field
                v-if="item.editing"
                v-model="item.budget"
                type="number"
                variant="outlined"
                dense
                single-line
                hide-details
                @blur="saveBudget(item)"
                @keydown.enter="saveBudget(item)"
                style="width: 150px; height: 30px; display: inline-block"
                :style="{ width: '150px', height: '36px' }"
              />
              <!-- ถ้า item.editing เป็น false จะไม่แสดงช่องกรอก แต่แสดงค่าเดิม -->
              <span v-else>
                {{ item.budget.toLocaleString() }}
              </span>
            </td>
            <td class="text-right">
              <v-btn
                color="transparent"
                icon
                @click="onEdit(item)"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-shadow: none;
                "
              >
                <v-icon>{{ item.editing ? 'mdi-check' : 'mdi-pencil-outline' }}</v-icon>
              </v-btn>
            </td>
            <td class="text-right">
              <v-btn
                color="transparent"
                icon
                @click="onClickDelete(item)"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-shadow: none;
                "
              >
                <img
                  src="@/assets/bin.png"
                  alt="Delete"
                  style="width: 35px; height: 35px; border: none"
                />
              </v-btn>
            </td>
            <td :style="{ textAlign: 'start', width: '10%' }">
              <v-btn icon variant="text" @click="toggleExpand(item)">
                <v-icon>{{
                  expanded.includes(item.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'
                }}</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>

        <!-- Expanded row -->
        <template v-slot:expanded-row="{ item }">
          <tr>
            <td colspan="6" style="text-align: left; padding-left: 50px">
              <v-data-table
                :headers="departmentHeaders"
                :items="expandedItems[item.faculty] || []"
                :hide-default-footer="true"
                dense
                fixed-header
                style="width: 100%; table-layout: fixed"
              >
                <template v-slot:item="{ item: subItem }">
                  <tr>
                    <td style="text-align: start; width: 40%">{{ subItem.department_name }}</td>
                    <td style="text-align: right; width: 20%">
                      <!-- แสดงค่า budget ถ้าไม่ได้อยู่ในโหมดการแก้ไข -->
                      <span v-if="!subItem.editing">
                        {{ subItem.budget ? subItem.budget.toLocaleString() : '0' }}
                      </span>

                      <!-- แสดง v-text-field ถ้าอยู่ในโหมดการแก้ไข -->
                      <v-text-field
                        v-if="subItem.editing"
                        v-model="subItem.budget"
                        type="number"
                        variant="outlined"
                        dense
                        single-line
                        hide-details
                        style="width: 150px; height: 30px; display: inline-block"
                        :style="{ width: '150px', height: '36px' }"
                      />
                    </td>
                    <td class="text-right" style="width: 10%">
                      <v-btn
                        color="transparent"
                        icon
                        @click="onEditSub(subItem)"
                        style="
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          box-shadow: none;
                        "
                      >
                        <v-icon>{{ subItem.editing ? 'mdi-check' : 'mdi-pencil-outline' }}</v-icon>
                      </v-btn>
                    </td>
                    <td class="text-right" style="width: 10%">
                      <v-btn
                        color="transparent"
                        icon
                        @click="onClickDeleteSub(subItem)"
                        style="
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          box-shadow: none;
                        "
                      >
                        <img
                          src="@/assets/bin.png"
                          alt="Delete"
                          style="width: 35px; height: 35px; border: none"
                        />
                      </v-btn>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </td>
          </tr>
        </template>

        <!-- แถวผลรวม -->
        <template v-slot:body.append>
          <tr>
            <td colspan="2" class="text-right font-weight-bold" style="padding: 8px">รวม</td>
            <td class="text-right font-weight-bold" style="padding: 8px">
              {{ formattedTotalUsedBudget }}
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-divider></v-divider>
    </v-container>
  </v-main>

  <!-- Dialog สำหรับ Add -->
  <v-dialog v-model="dialogAdd" max-width="500px" class="dialog-container">
    <v-card class="pa-4 card-dialog" style="background-color: #f5efe4; border-radius: 12px">
      <v-card-title
        class="d-flex align-center"
        style="
          background-color: #f8d8de;
          height: 80px;
          margin: -16px -16px 0 -16px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          justify-content: flex-end;
        "
      >
        <div
          style="
            flex-grow: 1;
            font-size: 16px;
            font-weight: bold;
            text-align: left;
            padding-left: 16px;
          "
        >
          งบประมาณทั้งหมด: {{ formattedTotalBudget }} บาท
          <br />
          งบประมาณคงเหลือ: {{ formattedRemainingBudget }} บาท
        </div>

        <v-icon
          @click="dialogAdd = false"
          color="red"
          class="cursor-pointer"
          style="font-size: 35px"
        >
          mdi-close
        </v-icon>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-row style="display: flex; align-items: center; margin-top: 12px">
          <v-col cols="2" style="text-align: left; font-size: 18px">คณะ:</v-col>
          <v-col cols="8">
            <v-text-field
              v-model="newFaculty"
              variant="outlined"
              dense
              style="margin-bottom: -20px; width: 100%"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row style="display: flex; align-items: center; margin-top: 12px">
          <v-col cols="2" style="text-align: left; font-size: 18px">จำนวน:</v-col>
          <v-col cols="8">
            <v-text-field
              v-model.number="newTotal"
              variant="outlined"
              dense
              type="number"
              style="margin-bottom: -20px; width: 100%"
              @focus="clearNewTotal"
              @input="updateRemainingBudget"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          @click="onSaveNewItem"
          class="elevated rounded-pill"
          style="background-color: #f5c8d0; color: #000; font-weight: bold; padding: 8px 16px"
        >
          บันทึก
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog สำหรับ Add Money -->
  <v-dialog v-model="dialogAddMoney" max-width="400px" class="dialog-container">
    <v-card class="pa-4 card-dialog" style="background-color: #f5efe4; border-radius: 12px">
      <v-card-title
        class="d-flex align-center"
        style="
          background-color: #f8d8de;
          height: 60px;
          margin: -16px -16px 0 -16px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          justify-content: flex-end;
        "
      >
        <div style="font-weight: bold">เพิ่มงบประมาณ</div>
        <v-spacer></v-spacer>
        <v-icon
          @click="dialogAddMoney = false"
          color="red"
          class="cursor-pointer"
          style="font-size: 35px"
        >
          mdi-close
        </v-icon>
      </v-card-title>

      <v-card-text class="pt-4">
        <!-- Radio Button สำหรับเลือกการทำรายการ -->
        <!-- <v-radio-group
          v-model="transactionType"
          row
          class="d-flex align-center"
          style="display: flex; flex-direction: row; gap: 16px"
        >
          <v-radio label="เพิ่มงบประมาณ" value="add"></v-radio>
          <v-radio label="ลดงบประมาณ" value="subtract"></v-radio>
        </v-radio-group> -->

        <!-- <v-divider class="my-4"></v-divider> -->

        <v-row style="display: flex; align-items: center; margin-top: 8px; margin-bottom: -8px">
          <v-col cols="3" style="text-align: left; font-size: 18px; padding-bottom: 0">
            จำนวนเงิน:
          </v-col>
          <v-col cols="8" style="padding-bottom: 0">
            <v-text-field
              v-model.number="moneyAmount"
              variant="outlined"
              dense
              type="number"
              style="margin: 0; width: 100%"
              @focus="clearMoneyAmount"
              @blur="resetMoneyAmount"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          @click="onSaveAddMoney"
          class="elevated rounded-pill"
          style="background-color: #f5c8d0; color: #000; font-weight: bold; padding: 8px 16px"
        >
          ยืนยัน
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogDelete" max-width="350px" class="dialog-container">
    <v-card
      class="pa-4 card-dialog"
      style="background-color: #f5efe4; border-radius: 12px; width: 350px"
    >
      <v-card-title
        class="d-flex align-center"
        style="
          background-color: #f8d8de;
          height: 60px;
          margin: -16px -16px 0 -16px;
          border-radius: 12px 12px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        "
      >
        ยืนยันการลบ
      </v-card-title>

      <v-card-text class="text-center"> คุณแน่ใจหรือไม่ว่าจะลบรายการนี้? </v-card-text>

      <v-card-actions class="d-flex justify-space-between">
        <v-btn
          variant="outlined"
          @click="dialogDelete = false"
          style="
            background-color: #2986cc;
            color: white;
            border: 2px solid #2986cc;
            border-radius: 8px;
          "
        >
          ยกเลิก
        </v-btn>

        <v-btn
          variant="outlined"
          @click="deleteItem"
          style="
            background-color: #f44336;
            color: white;
            border: 2px solid #f44336;
            border-radius: 8px;
          "
          >ลบ</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog สำหรับลบ SubItem -->
  <v-dialog v-model="dialogDeleteSub" max-width="350px" class="dialog-container">
    <v-card
      class="pa-4 card-dialog"
      style="background-color: #f5efe4; border-radius: 12px; width: 350px"
    >
      <v-card-title
        class="d-flex align-center"
        style="
          background-color: #f8d8de;
          height: 60px;
          margin: -16px -16px 0 -16px;
          border-radius: 12px 12px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        "
      >
        ยืนยันการลบสาขา
      </v-card-title>

      <v-card-text class="text-center"> คุณแน่ใจหรือไม่ว่าจะลบสาขานี้? </v-card-text>

      <v-card-actions class="d-flex justify-space-between">
        <v-btn
          variant="outlined"
          @click="dialogDeleteSub = false"
          style="
            background-color: #2986cc;
            color: white;
            border: 2px solid #2986cc;
            border-radius: 8px;
          "
          >ยกเลิก</v-btn
        >
        <v-btn
          variant="outlined"
          @click="deleteItemSub"
          style="
            background-color: #f44336;
            color: white;
            border: 2px solid #f44336;
            border-radius: 8px;
          "
          >ลบ</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import WebFontLoader from 'webfontloader'
import BuuLogo from '@/assets/Buu-logo11.png'
import axios from 'axios'

const loading = ref(false)
const selectedYear = ref(new Date().getFullYear())
const currentYear = new Date().getFullYear() + 543 // ปีปัจจุบันใน พ.ศ.
const years = Array.from({ length: currentYear - 2517 }, (_, i) => 2518 + i) // ช่วงปี พ.ศ. (เริ่มที่ 2518)
const router = useRouter()
const dialogAdd = ref(false) // สถานะการแสดง Dialog
const newFaculty = ref('') // ชื่อคณะใหม่
const newTotal = ref(0) // จำนวนงบประมาณใหม่
const dialogAddMoney = ref(false) // สถานะการแสดง Dialog สำหรับเพิ่มเงิน
const moneyAmount = ref(0) // จำนวนเงินที่เพิ่ม
const totalBudget = ref(0) // งบประมาณรวมเริ่มต้น
const items = ref()
const dialogDelete = ref(false) // สถานะการแสดง dialog
const selectedItem = ref(null) // ไว้เก็บข้อมูลของรายการที่เลือก
const animatedProgressValue = ref(0)
const yearBudgets = ref<Record<number, number>>({})
const transactionType = ref('add')
const isButtonLocked = ref(false)
const serverItems = ref([])
const expanded = ref([]) // เก็บ state ของแถวที่ถูกขยาย
const expandedItems = ref({}) // เก็บข้อมูล departments ของแต่ละ faculty
const selectedSubItem = ref(null)
const dialogDeleteSub = ref(false)

const onEdit = (item) => {
  item.editing = !item.editing // กดสลับระหว่างเปิด-ปิด
}

const onEditSub = (subItem) => {
  if (!subItem.editing) {
    subItem.budget = subItem.budget || 0 // ตั้งค่าเริ่มต้นเป็น 0 ถ้าไม่มีค่า
  }
  subItem.editing = !subItem.editing // สลับสถานะการแก้ไข
}

const headers = [
  { title: 'ID', value: 'id', align: 'start', width: '10%', minWidth: '80px' },
  { title: 'ชื่อคณะ', value: 'faculty', align: 'left', width: '40%', minWidth: '200px' },
  { title: 'งบประมาณ (บาท)', value: 'budget', align: 'end', width: '20%', minWidth: '150px' },
  { title: '', key: 'actions_edit', align: 'end', width: '10%' },
  { title: '', key: 'actions_delete', align: 'end', width: '10%' },
  { title: '', key: 'expand', align: 'start', width: '10%' },
]

const departmentHeaders = [
  { title: 'ชื่อสาขา', value: 'department_name', align: 'start', width: '40%', minWidth: '980px' },
  { title: '', value: 'budget', align: 'end', width: '20%', minWidth: '150px' },
  { title: '', key: 'actions_edit', align: 'end', width: '10%' },
  { title: '', key: 'actions_delete', align: 'end', width: '10%' },
  { title: '', key: 'expand', align: 'start', width: '10%' },
]

// const serverItems = ref([
//   { id: 1, faculty: 'คณะดนตรีและการแสดง', budget: 50000, date: '06/02/2568', editing: false },
//   { id: 2, faculty: 'คณะบริหารธุรกิจ', budget: 70000, date: '06/02/2568', editing: false },
//   { id: 3, faculty: 'คณะพยาบาลศาสตร์', budget: 60000, date: '06/02/2568', editing: false },
//   { id: 4, faculty: 'คณะภูมิสารสนเทศศาสตร์', budget: 50000, date: '06/02/2568', editing: false },
//   {
//     id: 5,
//     faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
//     budget: 70000,
//     date: '06/02/2568',
//     editing: false,
//   },
//   {
//     id: 6,
//     faculty: 'คณะรัฐศาสตร์และนิติศาสตร์',
//     budget: 60000,
//     date: '06/02/2568',
//     editing: false,
//   },
//   { id: 7, faculty: 'คณะวิทยาการสารสนเทศ', budget: 50000, date: '06/02/2568', editing: false },
//   { id: 8, faculty: 'คณะวิทยาศาสตร์', budget: 70000, date: '06/02/2568', editing: false },
//   { id: 9, faculty: 'คณะวิทยาศาสตร์การกีฬา', budget: 60000, date: '06/02/2568', editing: false },
//   {
//     id: 10,
//     faculty: 'คณะวิทยาศาสตร์และศิลปศาสตร์',
//     budget: 70000,
//     date: '06/02/2568',
//     editing: false,
//   },
//   {
//     id: 11,
//     faculty: 'คณะวิทยาศาสตร์และสังคมศาสตร์',
//     budget: 60000,
//     date: '06/02/2568',
//     editing: false,
//   },
//   { id: 12, faculty: 'คณะวิทยาศาสตร์', budget: 70000, date: '06/02/2567', editing: false },
//   { id: 13, faculty: 'คณะวิทยาศาสตร์การกีฬา', budget: 60000, date: '06/02/2567', editing: false },
// ])

const fetchFaculties = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://bookfair.buu.in.th:8043/faculties')
    serverItems.value = response.data.map((item, index) => ({
      id: index + 1,
      faculty: item.faculty_name, // ดึงค่า faculty_name มาใช้
      budget: item.e_coupon || 0, // กรณีไม่มีข้อมูล budget ให้ใช้ 0
      date: new Date().toLocaleDateString('th-TH'),
      editing: false,
    }))
  } catch (error) {
    console.error('Error fetching faculties:', error)
  } finally {
    loading.value = false
  }
}

// ฟังก์ชันดึงข้อมูลสาขาจาก API
const fetchDepartments = async (faculty) => {
  try {
    const response = await axios.get('http://bookfair.buu.in.th:8043/departments')

    console.log('All API Response:', response.data)

    // กรองโดยใช้ faculty name แทน faculty_id
    const filteredData = response.data.filter((dept) => dept.faculty_name === faculty) // ตรวจสอบให้แน่ใจว่าใช้ faculty_name ในการกรอง

    expandedItems.value[faculty] = filteredData

    console.log(`Filtered Data for faculty="${faculty}":`, expandedItems.value[faculty])
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

// ฟังก์ชันเมื่อคลิกที่แถว
const toggleExpand = async (item) => {
  console.log('Selected item:', item) // ตรวจสอบค่าที่ส่งมา

  if (!expanded.value.includes(item.id)) {
    expanded.value.push(item.id)

    if (item.faculty) {
      await fetchDepartments(item.faculty) // ตรวจสอบ faculty name ที่ถูกต้อง
    } else {
      console.error('Faculty name is missing for item:', item)
    }
  } else {
    expanded.value.splice(expanded.value.indexOf(item.id), 1)
  }
}

// ดึงข้อมูลงบประมาณจาก API
const fetchBudgetData = async () => {
  try {
    const response = await axios.get('http://bookfair.buu.in.th:8043/library')

    if (Array.isArray(response.data)) {
      // กรองเฉพาะปีที่เลือก
      const filteredData = response.data.filter((item) => item.budget_year === selectedYear.value)

      // รวม budget_amount ของปีที่เลือก
      totalBudget.value = filteredData.reduce((sum, item) => sum + (item.budget_amount || 0), 0)

      // ดึงปีทั้งหมดจาก API (กันซ้ำ)
      const uniqueYears = [...new Set(response.data.map((item) => item.budget_year))]
      years.value = uniqueYears.sort((a, b) => b - a) // เรียงปีจากมากไปน้อย
    }
  } catch (error) {
    console.error('Error fetching budget data:', error)
  }
}

const filteredItems = computed(() => {
  if (selectedYear.value) {
    const filtered = serverItems.value.filter((item) => {
      const itemYear = parseInt(item.date.split('/')[2]) // แยกปีจากวันที่
      if (isNaN(itemYear)) {
        console.error(`Invalid year in item: ${item.date}`) // ตรวจสอบค่าปีที่ผิดพลาด
        return false // หากปีไม่ถูกต้องไม่ให้แสดงรายการนี้
      }
      return itemYear === selectedYear.value
    })
    return filtered
  }
  return serverItems.value
})

const onClickAdd = () => {
  dialogAdd.value = true
}

const onSaveNewItem = () => {
  if (newFaculty.value && newTotal.value > 0) {
    // เพิ่มรายการใหม่ไปยัง serverItems
    serverItems.value.push({
      id: serverItems.value.length + 1,
      faculty: newFaculty.value,
      budget: newTotal.value,
      date: new Date().toLocaleDateString('th-TH'),
      editing: false,
    })

    // คำนวณงบประมาณที่เหลือ
    updateRemainingBudget()

    // รีเซ็ตค่า
    newFaculty.value = ''
    newTotal.value = 0
    dialogAdd.value = false
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const clearNewTotal = () => {
  if (newTotal.value === 0) {
    newTotal.value = '' // เปลี่ยนค่าเป็นค่าว่างเมื่อคลิกที่ช่องกรอก
  }
}

// ฟังก์ชันที่ถูกเรียกเมื่อคลิกปุ่มลบ
const onClickDelete = (item) => {
  selectedItem.value = item // เก็บข้อมูลรายการที่เลือก
  dialogDelete.value = true // แสดง dialog
}

const onClickDeleteSub = (subItem) => {
  console.log('เลือก subItem ที่จะลบ:', subItem) // ตรวจสอบค่า
  selectedSubItem.value = subItem // กำหนดค่า subItem ที่ต้องการลบ
  dialogDeleteSub.value = true // เปิด dialog ลบสาขา
}

// ฟังก์ชันลบรายการ
const deleteItem = () => {
  if (!selectedItem.value) return

  const index = serverItems.value.findIndex((i) => i.id === selectedItem.value.id)
  if (index !== -1) {
    serverItems.value.splice(index, 1)
  }

  dialogDelete.value = false
  selectedItem.value = null
}

const deleteItemSub = () => {
  if (!selectedSubItem.value) {
    console.error('ไม่มี subItem ที่เลือก')
    return
  }

  const faculty = selectedSubItem.value.faculty_name // แก้จาก faculty เป็น faculty_name
  if (!expandedItems.value[faculty]) {
    console.error(`ไม่พบ Faculty: ${faculty} ใน expandedItems`)
    return
  }

  // ใช้ department_id แทน id
  const departmentIndex = expandedItems.value[faculty].findIndex(
    (item) => item.department_id === selectedSubItem.value.department_id,
  )

  if (departmentIndex !== -1) {
    expandedItems.value[faculty].splice(departmentIndex, 1)
    console.log('ลบสำเร็จ:', selectedSubItem.value)
  } else {
    console.error('ไม่พบ subItem ที่ต้องการลบ')
  }

  dialogDeleteSub.value = false
  selectedSubItem.value = null
}

const updateRemainingBudget = () => {
  // คำนวณยอดรวมที่ใช้ไป
  const totalUsed = filteredItems.value.reduce((sum, item) => sum + item.budget, 0)

  // คำนวณงบประมาณที่เหลือ
  remainingBudget.value = totalBudget.value - totalUsed

  // อัพเดตค่าให้แสดงผลในฟอร์แมต
  formattedRemainingBudget.value = remainingBudget.value.toLocaleString()
}

// อัปเดตงบประมาณเมื่อเปลี่ยนปี
const onYearChange = () => {
  fetchBudgetData()
}

const onClickAddMoney = () => {
  // ล็อกปุ่มและเปิด dialog
  if (!isButtonLocked.value) {
    dialogAddMoney.value = true
    isButtonLocked.value = true // ป้องกันไม่ให้กดปุ่มได้อีก
  }
}

const onSaveAddMoney = () => {
  if (moneyAmount.value > 0 && selectedYear.value) {
    if (!yearBudgets.value[selectedYear.value]) {
      yearBudgets.value[selectedYear.value] = 0
    }

    if (transactionType.value === 'add') {
      yearBudgets.value[selectedYear.value] += moneyAmount.value
    } else if (transactionType.value === 'subtract') {
      yearBudgets.value[selectedYear.value] -= moneyAmount.value
    }

    totalBudget.value = Object.values(yearBudgets.value).reduce((sum, amount) => sum + amount, 0)

    moneyAmount.value = 0
    dialogAddMoney.value = false
  } else {
    alert('กรุณากรอกจำนวนเงินและเลือกปี')
  }
}

const clearMoneyAmount = () => {
  if (moneyAmount.value === 0) {
    moneyAmount.value = '' // เคลียร์ค่าถ้าเป็น 0
  }
}

const resetMoneyAmount = () => {
  if (moneyAmount.value === '' || moneyAmount.value === null) {
    moneyAmount.value = 0 // รีเซ็ตค่าเป็น 0 หากกรอกไม่ได้
  }
}

const usedBudget = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + item.budget, 0)
})

const usedBudgetByFaculty = computed(() => {
  return filteredItems.value.reduce(
    (acc, item) => {
      if (!acc[item.faculty]) {
        acc[item.faculty] = 0
      }
      acc[item.faculty] += item.budget
      return acc
    },
    {} as Record<string, number>,
  )
})

const totalUsedBudget = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + (parseFloat(item.budget) || 0), 0)
})

const formattedTotalUsedBudget = computed(() => totalUsedBudget.value.toLocaleString())

const formattedTotalBudget = computed(() => totalBudget.value.toLocaleString())

const remainingBudget = computed(() => totalBudget.value - totalUsedBudget.value)

const formattedRemainingBudget = computed(() => remainingBudget.value.toLocaleString())

const progressPercentage = computed(() => {
  return (totalUsedBudget.value / totalBudget.value) * 100
})

// const progressValue = computed(() =>
//   totalBudget.value > 0 ? (usedBudget.value / totalBudget.value) * 100 : 0,
// )

const getProgressColor = (progress) => {
  if (progress < 50) return 'green'
  if (progress < 80) return 'orange'
  return 'red'
}

const startEditing = (item) => {
  item.editing = true
}

const saveBudget = (item) => {
  // แปลงค่าที่ป้อนเป็นตัวเลข ถ้าไม่ใช่ตัวเลขให้ใช้ค่า 0
  const newBudget = parseFloat(item.budget) || 0
  const oldBudget = item.oldBudget || 0 // เก็บค่าก่อนแก้ไข

  // คำนวณความเปลี่ยนแปลงของงบประมาณ
  const difference = newBudget - oldBudget

  // อัปเดตงบประมาณใหม่
  item.budget = newBudget
  item.oldBudget = newBudget

  // อัปเดตค่า totalUsedBudget และ remainingBudget
  totalUsedBudget.value += difference
  remainingBudget.value = totalBudget.value - totalUsedBudget.value

  // อัปเดตการ์ดแสดงผล
  formattedTotalUsedBudget.value = totalUsedBudget.value.toLocaleString()
  formattedRemainingBudget.value = remainingBudget.value.toLocaleString()

  // ปิดโหมดแก้ไข
  item.editing = false
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
  const doc = new jsPDF()

  const fontBase64 = await loadFontAsBase64('/Sarabun/Sarabun-Regular.ttf')
  doc.addFileToVFS('Sarabun-Regular.ttf', fontBase64)
  doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal')
  doc.setFont('Sarabun', 'normal')
  doc.setFontSize(16)

  const logoBase64 = await imageBuu()
  const logoWidth = 30
  const logoHeight = 30
  const logoX = (doc.internal.pageSize.width - logoWidth) / 2
  const logoY = 20
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight)

  const formattedDate = formatDatePdf()

  const text = 'สรุปงบประมาณ'
  const text_x = (doc.internal.pageSize.width - doc.getTextWidth(text)) / 2
  const text_y = logoY + logoHeight + 10
  doc.text(text, text_x, text_y)

  const text1 = `ประจำปี ${selectedYear.value}`
  const text1_x = (doc.internal.pageSize.width - doc.getTextWidth(text1)) / 2
  const text1_y = text_y + 10
  doc.text(text1, text1_x, text1_y)

  doc.setFontSize(11)
  const dateX = doc.internal.pageSize.width - doc.getTextWidth(formattedDate) - 10
  const dateY = 10
  doc.text(formattedDate, dateX, dateY)

  const tableData = filteredItems.value.map((item, index) => [
    (index + 1).toString(),
    item.faculty,
    item.budget.toLocaleString(),
  ])

  autoTable(doc, {
    head: [['ลำดับ', 'คณะ', 'จำนวนเงิน (บาท)']],
    body: tableData,
    startY: text_y + 20,
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

  const totalBudget = filteredItems.value
    .reduce((sum, item) => sum + item.budget, 0)
    .toLocaleString()
  const totalText = `งบประมาณรวม ${totalBudget} บาท`
  doc.setFontSize(14)
  doc.text(
    totalText,
    doc.internal.pageSize.width - doc.getTextWidth(totalText) - 10,
    doc.lastAutoTable.finalY + 10,
  )

  doc.save(`budget-summary-${selectedYear.value}.pdf`)
}

watch(newTotal, updateRemainingBudget)

watch(progressPercentage, (newValue) => {
  animatedProgressValue.value = newValue
})

watch([filteredItems, totalBudget], () => {
  updateRemainingBudget()
})

watch(filteredItems, () => {
  updateRemainingBudget()
})

watch(totalUsedBudget, (newValue) => {
  remainingBudget.value = totalBudget.value - newValue
  formattedRemainingBudget.value = remainingBudget.value.toLocaleString()
})

watch(expanded, async (newVal) => {
  for (const item of newVal) {
    if (!expandedItems.value[item.id]) {
      await fetchDepartments(item.id)
    }
  }
})

onMounted(() => {
  fetchFaculties()
  fetchBudgetData()
})

onMounted(() => {
  selectedYear.value = new Date().getFullYear() + 543
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

.summary-card {
  background-color: #e0e6f0;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  width: 300px;
}

.summary-title {
  font-weight: bold;
  font-size: 18px;
}

.summary-amount {
  font-size: 20px;
  color: #000;
}

.summary-row {
  display: flex;
  align-items: center; /* จัดให้อยู่ตรงกลางในแนวตั้ง */
  justify-content: space-between; /* เว้นระยะระหว่างข้อความและตัวเลข */
}

.summary-card-remain {
  background-color: #e0e6f0;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  width: 400px;
}

.summary-label {
  font-size: 18px;
  font-weight: bold;
}

.summary-amount {
  font-size: 18px;
  color: #464545;
  margin-left: 8px; /* เพิ่มระยะห่างเล็กน้อย */
}

.budget-table {
  margin-top: 20px;
}

.dialog-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* ทำให้ Dialog อยู่กลางแนวตั้ง */
}

.card-dialog {
  width: 600px;
  text-align: center; /* จัดข้อความตรงกลาง */
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cursor-pointer {
  cursor: pointer;
}

.budget-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.budget-table th,
.budget-table td {
  padding: 8px;
  text-align: center;
  word-wrap: break-word;
}

.budget-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.budget-table td.text-left {
  text-align: left;
}

.budget-table td.text-right {
  text-align: right;
}

.budget-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialog-container {
  border-radius: 12px;
}

.card-dialog {
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cursor-pointer {
  cursor: pointer;
}

.budget-table td.text-left {
  text-align: left; /* จัดข้อมูลในคอลัมน์คณะให้ชิดซ้าย */
}

.budget-table td.text-right {
  text-align: right; /* จัดข้อมูลในคอลัมน์งบประมาณให้ชิดขวา */
}

.budget-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-container {
  position: relative; /* กำหนดให้เป็น container สำหรับหลอดซ้อนทับ */
  height: 18px; /* ความสูงของหลอด */
}

.v-progress-linear {
  border-radius: 10px; /* ทำให้มุมโค้ง */
}

.v-progress-linear__background {
  background-color: #e0e0e0; /* สีพื้นหลังของหลอดเป้าหมาย */
}

.v-progress-linear__determinate {
  transition: width 0.5s ease; /* เพิ่ม animation ให้ความคืบหน้า */
}
</style>
