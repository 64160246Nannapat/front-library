<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container>
      <!-- Header Section -->
      <div class="header">
        <img class="header-image" src="@/assets/bookLibrary.png" alt="Library Image" />
        <h1>จัดการเสนอซื้อหนังสือ</h1>

        <!-- Date Picker -->
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
                  class="custom-date-picker custom-border"
                  hide-details
                  readonly
                  flat
                  solo
                  prepend-inner-icon="$calendar"
                  suffix-icon="mdi-calendar"
                />
              </template>

              <v-date-picker v-model="selectedDate" @input="menuDate = false" locale="th" />
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="auto">

          </v-col>
        </v-row>
      </div>

      <!-- Table for displaying data -->
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">ลำดับ</th>
            <th class="text-left">ข้อมูลผู้คัดเลือก</th>
            <th class="text-left">ชื่อหนังสือ</th>
            <th class="text-left">ISBN</th>
            <th class="text-left">ร้านค้า</th>
            <th class="text-left">ราคา</th>
            <th class="text-left">จำนวน</th>
            <th class="text-left">รูปภาพ</th>
            <th class="text-left">ตรวจการซ้ำ</th>
            <th class="text-left">ดำเนินการ</th>
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import HomeLibrary from '@/components/library/HomeLibrary.vue';

const selectedDate = ref(new Date()) // วันที่ที่เลือก
const menuDate = ref(false) // ควบคุมการเปิด/ปิดเมนูเลือกวันที่

const desserts = ref([
  {
    id: 1,
    date: '01/12/2567',
    title: 'หนังสือ A',
    isbn: '978-3-16-148410-0',
    price: 250,
    quantity: 2,
    status: 'อนุมัติ',
  },
  {
    id: 2,
    date: '02/12/2567',
    title: 'หนังสือ B',
    isbn: '978-0-306-40615-7',
    price: 350,
    quantity: 1,
    status: 'อนุมัติ',
  },
  {
    id: 3,
    date: '03/12/2567',
    title: 'หนังสือ C',
    isbn: '978-1-4028-9462-6',
    price: 500,
    quantity: 3,
    status: 'ไม่อนุมัติ',
  },
]);

// แปลงวันที่ที่เลือกให้เป็นฟอร์แมต dd/mm/yyyy
const formattedDate = computed(() => {
  if (!selectedDate.value) return '';
  const date = new Date(selectedDate.value);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear() + 543;
  return `${day}/${month}/${year}`;
});

// กรองข้อมูลตามวันที่ที่เลือก
const filteredDesserts = computed(() => {
  if (!formattedDate.value) return desserts.value;
  return desserts.value.filter((item) => item.date === formattedDate.value);
});
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
  box-sizing: border-box;
  white-space: nowrap; /* ห้ามตัดข้อความขึ้นบรรทัดใหม่ */
  overflow: visible; /* แสดงข้อความที่เกิน */
  text-overflow: unset; /* ปิด ellipsis (...) */
  width: 100px;
  min-width: 300px;
  text-align: center; /* จัดข้อความอยู่กลาง */
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
</style>
