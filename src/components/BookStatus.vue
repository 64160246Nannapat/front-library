<template>
  <v-main style="height: 500px">
    <HomeStudent />

    <v-main>
      <v-container>
        <div class="header">
          <img class="header-image" src="@/assets/check-list (1).png" alt="Library Image" />
          <h1>สถานะการเสนอซื้อหนังสือ</h1>

          <!-- จัดตำแหน่ง date picker ขวาสุดโดยไม่ทับกับส่วนอื่น -->
          <v-row align="center" class="date-status-row" justify="space-between">
            <v-col cols="auto">
              <!-- ใส่คอนเทนต์อื่นๆ เช่น หัวข้อ หรือ ข้อความ ถ้าจำเป็น -->
            </v-col>

            <v-col cols="auto">
              <!-- ใช้ v-menu เพื่อแสดงและซ่อน v-date-picker -->
              <v-menu
                v-model="menuDate"
                :close-on-content-click="false"
                transition="slide-x-reverse-transition"
              >
                <template v-slot:activator="{ on, props }">
                  <!-- แสดงกรอบวันที่ที่เลือก -->
                  <v-text-field
                    v-bind="props"
                    v-on="on"
                    v-model="selectedDate"
                    label="เลือกวันที่"
                    readonly
                    class="date-picker-input"
                    dense
                    outlined
                  />
                </template>

                <!-- ตัวเลือกวันที่ -->
                <v-date-picker
                  v-model="selectedDate"
                  @input="menuDate = false"
                  :max="maxDate"
                  locale="th"
                  class="date-picker-calendar"
                />
              </v-menu>
            </v-col>
          </v-row>
        </div>

        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left">ลำดับ</th>
              <th class="text-left">วันที่</th>
              <th class="text-left">ชื่อหนังสือ</th>
              <th class="text-left">ISBN</th>
              <th class="text-left">ราคาสุทธิ</th>
              <th class="text-left">จำนวน</th>
              <th class="text-left">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredDesserts" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.date }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.isbn }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HomeStudent from '@/components/student/HomeStudent.vue'

const selectedDate = ref(null)
const menuDate = ref(false)
const maxDate = '2024-12-31'

// ข้อมูลรายการหนังสือ
const desserts = ref([
  {
    id: 1,
    date: '2024-12-01',
    title: 'หนังสือ A',
    isbn: '978-3-16-148410-0',
    price: 250,
    quantity: 2,
    status: 'อนุมัติ',
  },
  {
    id: 2,
    date: '2024-12-02',
    title: 'หนังสือ B',
    isbn: '978-0-306-40615-7',
    price: 350,
    quantity: 1,
    status: 'อนุมัติ',
  },
  {
    id: 3,
    date: '2024-12-03',
    title: 'หนังสือ C',
    isbn: '978-1-4028-9462-6',
    price: 500,
    quantity: 3,
    status: 'ไม่อนุมัติ',
  },
])

// กรองข้อมูลตามวันที่เลือก
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

.v-simple-table {
  width: 100%;
  max-height: 600px;
  overflow: auto;
  font-size: 18px;
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

/* การจัดแถวสำหรับเลือกวันที่และสถานะ */
.date-status-row {
  margin-bottom: 20px;
}

/* ปรับความกว้างของส่วนเลือกวันที่และสถานะ */
.v-row {
  display: flex;
  justify-content: space-between;
}

.v-col {
  max-width: 300px;
}

/* เพิ่มกรอบให้กับ input ของ date picker */
.date-picker-input {
  position: relative;
  max-width: 250px; /* กำหนดขนาดความกว้างของกรอบ */
}

/* ปรับสไตล์ให้กับ input */
.date-picker-input input {
  cursor: pointer;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #000000; /* กำหนดสีกรอบ */
  border-radius: 8px; /* มุมโค้ง */
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

/* เพิ่มกรอบเมื่อเลือกวันที่ */
.date-picker-input input:focus {
  border-color: #000000; /* สีของกรอบเมื่อโฟกัส */
  background-color: #ffffff;
}

/* เพิ่มกรอบล้อมรอบทั้งปฏิทิน */
.date-picker-calendar {
  border: 2px solid #000000; /* กำหนดกรอบสำหรับปฏิทิน */
  border-radius: 8px; /* ทำมุมโค้ง */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
}
</style>
