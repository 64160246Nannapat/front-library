<template>
  <v-main style="height: 500px">
    <v-main>
      <v-container class="ecoupon-container">
        <!-- Header -->
        <v-row align="center" justify="space-between">
          <v-col>
            <div class="header">
              <img class="header-image" src="@/assets/salary (1).png" alt="Library Image" />
              <h1>สรุปงบประมาณ</h1>
            </div>
          </v-col>
          <v-col>
            <v-card class="mx-auto card-money">
              <v-card-title class="card-money-title">E-coupon คงเหลือ</v-card-title>

              <v-card-subtitle class="card-money-subtitle">0 บาท</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
.ecoupon-container {
  background-color: #fff9f4;
  height: 100vh;
  padding: 20px;
}

.title {
  font-weight: bold;
  font-size: 18px;
}

.balance-card {
  padding: 10px;
  background-color: #f3f8ff;
  border-radius: 8px;
}

.balance-amount {
  font-weight: bold;
  font-size: 16px;
  color: #000;
}

.coupon-card {
  background-color: #ef9595;
  border-radius: 16px;
  width: 500px;
  height: 700px;
  padding: 20px;
  text-align: center;
}

.coupon-card .amount {
  font-weight: bold;
  font-size: 24px;
}

.coupon-divider {
  margin-top: 10px;
  border-style: dashed;
  border-color: #fff;
  border-width: 2px;
}

.card-money {
  background-color: #e0e6f0;
  height: 100px;
  width: 600px;
  max-width: 340px;
  border: none; /* ไม่มีขอบ */
  text-align: center; /* จัดตัวอักษรให้อยู่ตรงกลาง */
  display: flex;
  flex-direction: column;
  justify-content: center; /* จัดเนื้อหาให้อยู่ตรงกลางในแนวตั้ง */
  align-items: center; /* จัดเนื้อหาให้อยู่ตรงกลางในแนวนอน */
}

.card-money .v-card__title {
  font-size: 20px; /* ขนาดของหัวข้อ */
  font-weight: bold; /* ตัวหนาสำหรับหัวข้อ */
  color: #000000; /* สีเขียวสำหรับหัวข้อ */
}

.card-money .v-card__subtitle {
  font-size: 18px; /* ขนาดของคำอธิบาย */
  color: #000000; /* สีแดงสำหรับคำอธิบาย */
}

.qr-code-image {
  width: 300px;
}

.text-card {
  font-size: 30px;
  color: #000;
}

.text-card-sub {
  font-size: 20px;
  color: #000;
}

.text-magin {
  margin-bottom: 60px;
}

.card-money-title {
  font-size: 24px; /* ขนาดตัวอักษรหัวข้อ */
  font-weight: bold;
  color: #000;
}

.card-money-subtitle {
  font-size: 20px; /* ขนาดตัวอักษรคำอธิบาย */
  color: #666;
}
</style>
