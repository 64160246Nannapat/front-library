<template>
  <v-main style="height: 500px; margin-top: -45px">
    <v-main>
      <v-container class="ecoupon-container">
        <!-- Header -->
        <v-row align="center" justify="space-between">
          <v-col>
            <div class="header">
              <img class="header-image" src="@/assets/budget-color.png" alt="Budget" />
              <h1>E-Coupon</h1>
            </div>
          </v-col>
          <v-col>
            <v-card class="mx-auto card-money justify-end">
              <v-card-title class="card-money-title">E-coupon คงเหลือ</v-card-title>

              <v-card-subtitle class="card-money-subtitle">3,000 บาท</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>

        <!-- Coupon Section -->
        <v-row justify="center" class="mt-10">
          <v-card class="mx-auto text-white coupon-card" color="#EF9595">
            <template v-slot:prepend>
              <v-avatar
                color="grey-darken-3"
                size="x-large"
                image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
              ></v-avatar>
            </template>

            <v-card-text class="text-h5 py-2">
              <QRCode />
            </v-card-text>

            <v-card-actions>
              <v-list-item class="w-100">
                <v-list-item-title class="text-card">อาจารย์วรวิทย์ วีระพันธุ์</v-list-item-title>
                <v-list-item-subtitle class="text-card-sub text-magin"
                  >คณะวิทยาการสารสนเทศ</v-list-item-subtitle
                >
                <v-list-item-title class="text-card"> 3,000 </v-list-item-title>
                <v-list-item-subtitle class="text-card-sub">บาท</v-list-item-subtitle>
              </v-list-item>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </v-main>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import QRCode from '@/views/QRCode.vue'
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
  width: 400px;
  height: 600px;
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
  height: 110px;
  width: 600px;
  max-width: 340px;
  border-radius: 10px;
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
  width: 250px;
}

.text-card {
  font-size: 25px;
  color: #000;
}

.text-card-sub {
  font-size: 18px;
  color: #000;
  margin-top: 8px;
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
  margin-bottom: 10px;
}
</style>
