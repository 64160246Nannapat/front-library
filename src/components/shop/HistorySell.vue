<template>
  <v-main style="height: 500px">
    <HomeShop />

    <v-main>
      <v-container>
        <div class="header">
          <img class="header-image" src="@/assets/file (1).png" alt="File Image" />
          <h1>ประวัติการขาย</h1>

          <v-row align="center" class="date-status-row" justify="end">
            <v-col cols="auto">
              <!-- ที่อยู่ตาราง -->
              <v-menu
                v-model="menuDate"
                :close-on-content-click="false"
                transition="scale-transition"
              >
                <!-- รูปแบบกรอบ input วันที่-->
                <template v-slot:activator="{ on, props }">
                  <v-text-field
                    v-bind="props"
                    v-on="on"
                    v-model="selectedDate"
                    placeholder="dd/mm/yyyy"
                    readonly
                    class="custom-date-picker custom-width"
                  />
                </template>
                <!-- ตารางวันที่ -->
                <v-date-picker
                  v-model="selectedDate"
                  @input="menuDate = false"
                  :max="maxDate"
                  locale="th"
                />
              </v-menu>
            </v-col>
          </v-row>
        </div>

        <!-- Table Section -->
        <v-simple-table>
          <thead>
            <tr class="table-width">
              <th class="text-left">ลำดับ</th>
              <th class="text-left">ชื่อหนังสือ</th>
              <th class="text-left">ราคาสุทธิ</th>
              <th class="text-left">จำนวน</th>
              <th class="text-left">ประเภท</th>
            </tr>
          </thead>
          <tbody class="table-width">
            <tr v-for="item in filteredDesserts" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.type }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HomeShop from '@/components/shop/HomeShop.vue'

// Variables
const selectedDate = ref(null)
const menuDate = ref(false)
const maxDate = '2024-12-31'

// Sample Data
const desserts = ref([
  {
    id: 1,
    title: 'หนังสือ A',
    price: 250,
    quantity: 2,
    type: 'มีคูปอง',
  },
  {
    id: 2,
    title: 'หนังสือ B',
    price: 350,
    quantity: 1,
    type: 'ไม่มีคูปอง',
  },
  {
    id: 3,
    title: 'หนังสือ C',
    price: 500,
    quantity: 3,
    type: 'มีคูปอง',
  },
])

// Filter Books by Selected Date
const filteredDesserts = computed(() => {
  if (!selectedDate.value) return desserts.value
  return desserts.value.filter((item) => item.date === selectedDate.value)
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

/* เลือกวันที่และข้อมูลในตารางวันที่*/
.custom-date-picker {
  border: 2px solid #000; /* กรอบสีดำ */
  border-radius: 12px; /* มุมโค้ง */
  background-color: #fff; /* พื้นหลังขาว */
  cursor: pointer;
  font-size: 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  overflow: visible;
  padding-left: 10px;
}

.custom-width {
  width: 250px;
}

.custom-date-picker:hover {
  border-color: #707478; /* เปลี่ยนสีกรอบตอนชี้ */
}

/* ข้อความในกรอบ */
.custom-date-picker input {
  font-size: 18px; /* ขนาดข้อความ */
  border: none; /* ลบเส้นขอบของ input */
  outline: none; /* ลบเส้นโฟกัส */
  width: 100%; /* ให้ข้อความใช้พื้นที่เต็ม */
  height: 100%; /* ให้ข้อความครอบคลุมความสูง */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
  background-color: transparent;
  white-space: nowrap; /* ป้องกันการหักบรรทัด */
  overflow: visible; /* ป้องกันการแสดงข้อความเกินกรอบ */
  padding: 0; /* ลบระยะห่างใน input */
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
}

th,
td {
  padding: 16px;
  text-align: left;
}

th {
  font-weight: bold;
  font-size: 20px;
}

.table-width {
  width: 100px;
}
</style>
