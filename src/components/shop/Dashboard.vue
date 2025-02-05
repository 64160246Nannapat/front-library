<template>
  <v-main style="height: 500px; margin-top: 20px">
    <v-container>
      <!-- Header -->
      <div class="header">
        <img class="header-image" src="@/assets/dashboard (1).png" alt="Library Image" />
        <h1>Dashboard</h1>
      </div>

      <!-- ยอดขายประจำเดือน -->
      <v-row>
        <v-col cols="12" md="12">
          <v-card outlined class="pa-4" style="border: 2px solid black; border-radius: 10px">
            <v-card-title>ยอดขายประจำเดือน มกราคม 2568</v-card-title>
            <div class="chart-container">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- 5 อันดับหนังสือถูกเสนอซื้อ และ Top 5 Best Seller -->
      <v-row>
        <v-col cols="12" md="7">
          <v-card outlined class="pa-4" style="border: 2px solid black; border-radius: 10px">
            <v-card-title>5 อันดับหนังสือที่ถูกเสนอซื้อมากที่สุด (คูปอง)</v-card-title>
            <div class="chart-container">
              <canvas ref="proposalChartCanvas"></canvas>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card outlined class="pa-4">
            <v-card-title>Top 5 Best Seller</v-card-title>
            <v-list>
              <v-list-item v-for="(item, index) in bestSellers" :key="index">
                <v-row class="w-100">
                  <v-col cols="8">
                    <v-list-item-title>{{ index + 1 }}. {{ item.title }}</v-list-item-title>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <v-list-item-subtitle>{{ item.amount }} เล่ม</v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <!-- รายชื่อที่ทำการเสนอล่าสุด -->
      <v-row>
        <v-col cols="12" md="12">
          <v-card outlined class="pa-4">
            <v-card-title>รายชื่อที่ทำการเสนอล่าสุด (ทำการอนุมัติแล้ว)</v-card-title>
            <v-row class="justify-end">
              <v-col cols="auto">
                <div class="text-right">
                  {{ formattedDate }}
                </div>
              </v-col>
            </v-row>

            <v-data-table
              :headers="tableHeaders"
              :items="recentProposals"
              item-key="name"
              :hide-default-footer="true"
            >
              <template v-slot:item="{ item, index }">
                <tr>
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.role }}</td>
                  <td>{{ item.book }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { Chart } from 'chart.js/auto'

// ฟังก์ชันเพื่อแสดงวันที่ในรูปแบบที่ต้องการ
const formattedDate = computed(() => {
  const today = new Date()
  const day = today.getDate().toString().padStart(2, '0')
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const year = today.getFullYear() + 543 // เพิ่ม 543 สำหรับปี พ.ศ.
  return `${day}/${month}/${year}`
})

// ข้อมูลสำหรับ Best Sellers
const bestSellers = ref([
  { title: 'ภาวะลื่นไหล ทำอะไรก็ง่ายหมด', amount: 26 },
  { title: 'ปรัชญาแมว ปรัชญาเหมียว', amount: 25 },
  { title: 'หัวไม่ดีก็มีวิธีสอบผ่าน', amount: 23 },
  { title: 'แด่วัย 30 ผู้คิดมาก', amount: 23 },
  { title: 'นิทานไขตำนานปริศนา', amount: 16 },
])

// ข้อมูลสำหรับ Proposals
const proposals = ref([
  { name: 'แผลเก่า', amount: 20 },
  { name: 'ไผ่แดง', amount: 18 },
  { name: 'สี่แผ่นดิน', amount: 12 },
  { name: 'ความฝันของนักเขียน', amount: 8 },
  { name: 'เมืองนิมิตร', amount: 5 },
])

// ข้อมูลสำหรับ Recent Proposals
const recentProposals = ref([
  { name: 'ผศ.ดร พิเชษ วะยะลุน', role: 'อาจารย์', book: 'แผลเก่า' },
  { name: 'นาย เกรียงศักดิ์ ปานโพธิ์ทอง', role: 'บุคลากร', book: 'ความฝันของนักเขียน' },
  { name: 'อาจารย์ วรวิทย์ วีระพันธุ์', role: 'อาจารย์', book: 'แมวยิ้มง่ายใช่ว่าแตกสลายไม่เป็น' },
  { name: 'อาจารย์ เหมรัศมิ์ วชิรหัตถพงศ์', role: 'อาจารย์', book: '4 วินาที = Four seconds' },
])

const tableHeaders = [
  { title: 'ลำดับ', align: 'start', key: 'id' },
  { title: 'ชื่อ', align: 'start', key: 'name' },
  { title: 'ตำแหน่ง', align: 'start', key: 'role' },
  { title: 'หนังสือ', align: 'start', key: 'book' },
]

// ใช้ ref เพื่อให้ Vue จัดการ <canvas>
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const proposalChartCanvas = ref<HTMLCanvasElement | null>(null)

// เมื่อ Component ถูก mounted
onMounted(async () => {
  await nextTick() // รอ Vue render ก่อนสร้างกราฟ

  if (chartCanvas.value) {
    new Chart(chartCanvas.value, {
      type: 'line', // กราฟเส้น
      data: {
        labels: ['1 ม.ค.', '7 ม.ค.', '14 ม.ค.', '21 ม.ค.', '28 ม.ค.'], // แกน X (วันในเดือน ม.ค.)
        datasets: [
          {
            label: 'ยอดขาย',
            data: [20000, 35000, 50000, 42000, 60000], // ข้อมูลยอดขาย
            borderColor: 'rgba(255, 99, 132, 1)', // สีเส้น
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // สีพื้นหลัง (ถ้ามี fill)
            fill: false,
            tension: 0.3, // ทำให้เส้นโค้งมน
            pointStyle: 'circle',
            pointRadius: 5,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          },
          {
            label: 'ยอดขาย (ปีก่อนหน้า)',
            data: [18000, 30000, 45000, 39000, 55000], // เปรียบเทียบกับช่วงก่อนหน้า
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            tension: 0.3,
            borderDash: [5, 5], // เส้นประ
            pointStyle: 'circle',
            pointRadius: 5,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false, // ซ่อนเส้น Grid แกน X
            },
            title: {
              display: true,
              text: 'วันที่', // แสดงชื่อแกน X
            },
          },
          y: {
            grid: {
              drawBorder: false,
              color: 'rgba(0, 0, 0, 0.1)',
            },
            beginAtZero: true, // ให้เริ่มที่ 0
            title: {
              display: true,
              text: 'ยอดขาย (บาท)', // แสดงชื่อแกน Y
            },
          },
        },
      },
    })
  }

  // สร้างกราฟ Horizontal Bar Chart สำหรับ 5 อันดับหนังสือที่ถูกเสนอซื้อ
  if (proposalChartCanvas.value) {
    new Chart(proposalChartCanvas.value, {
      type: 'bar', // กราฟแท่ง
      data: {
        labels: proposals.value.map((item) => item.name), // ชื่อหนังสือ
        datasets: [
          {
            label: 'จำนวนเล่มที่เสนอซื้อ',
            data: proposals.value.map((item) => item.amount), // จำนวนเล่ม
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // สีพื้นหลังของแท่ง
            borderColor: 'rgba(75, 192, 192, 1)', // สีขอบของแท่ง
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y', // การแสดงกราฟในแนวนอน
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true, // ให้เริ่มที่ 0
            title: {
              display: true,
              text: 'จำนวนเล่ม', // ชื่อแกน X
            },
          },
          y: {
            title: {
              display: true,
              text: 'หนังสือ', // ชื่อแกน Y
            },
          },
        },
      },
    })
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-image {
  width: 75px;
  height: auto;
  margin-right: 15px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.v-data-table td,
.v-data-table th {
  padding: 10px; /* เพิ่มช่องว่างให้ตาราง */
}
</style>
