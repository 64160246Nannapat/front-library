<template>
  <v-main style="height: 600px">
    <HomeShop />

    <v-main>
      <v-container>
        <div class="header">
          <img class="header-image" src="@/assets/book (1).png" alt="Book" />
          <h1>จัดการหนังสือ</h1>
          <v-col col="100px">
            <v-btn class="header-btn" color="primary" @click="addBook">เพิ่มหนังสือ</v-btn>
          </v-col>
        </div>

        <!-- Table Section -->
        <v-simple-table class="custom-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ชื่อหนังสือ</th>
              <th>ISBN</th>
              <th>ราคาสุทธิ</th>
              <th>จำนวน</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in desserts" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.isbn }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeShop from '@/components/shop/HomeShop.vue'

// Sample Data
const desserts = ref([
  {
    id: 1,
    title: 'หนังสือ A',
    isbn: '978-3-16-148410-0',
    price: 250,
    quantity: 2,
  },
  {
    id: 2,
    title: 'หนังสือ B',
    isbn: '978-0-306-40615-7',
    price: 350,
    quantity: 1,
  },
  {
    id: 3,
    title: 'หนังสือ C',
    isbn: '978-1-4028-9462-6',
    price: 500,
    quantity: 3,
  },
])

// const addBook = () => {
//   desserts.value.push({
//     id: Date.now(),
//     title: '',
//     isbn: '',
//     price: 0,
//     quantity: 1,
//   })
// }
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-btn {
  justify-content: space-between; /* จัดปุ่มให้ชิดขอบขวา */
}

.header-image {
  width: 60px;
  height: auto;
  margin-right: 15px;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.custom-table {
  width: 120%; /* เพิ่มความกว้างของตาราง */
  font-size: 20px; /* ขนาดตัวอักษรในตาราง */
  border-collapse: collapse;
  margin-left: auto; /* จัดกึ่งกลางในกรณีเกินพื้นที่ */
  margin-right: auto;
}

/* th หัวตาราง td ในตาราง */
.custom-table th,
.custom-table td {
  padding: 20px; /* เพิ่มระยะห่างในช่อง */
  text-align: center;
}

.custom-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.custom-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
