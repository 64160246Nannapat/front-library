<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/list.png" alt="Library Image" />
        <h1>รายชื่อผู้เสนอหนังสือ</h1>
      </div>
      <h3>รายการเสนอหนังสือ เล่มที่ 1</h3>
      <v-card class="mx-auto my-8 card">
        <v-card-text>
          <v-row justify="center">
            <v-col>
              <v-text>รหัส:</v-text>
            </v-col>
            <v-col>
              <v-text>ผู้กรอก: นันท์ณภัทร สอนสุภาพ</v-text>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col>
              <v-text>ร้านค้า: แจ่มใส</v-text>
            </v-col>
            <v-col>
              <v-text>ชื่อผู้แต่ง: เผิงไหลเค่อ</v-text>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col>
              <v-text>ชื่อเรื่อง: ปรปักษ์จำนน</v-text>
            </v-col>
            <v-col>
              <v-text>ISBN: 9786160631308</v-text>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col>
              <v-text>ปีที่พิมพ์: 2566</v-text>
            </v-col>
            <v-col>
              <v-text>พิมพ์ครั้งที่: 5</v-text>
            </v-col>
            <v-col>
              <v-text>จำนวน: 1 เล่ม</v-text>
            </v-col>
            <v-col>
              <v-text>ราคาสุทธิ: 415 บาท</v-text>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <h3>รายการเสนอหนังสือ เล่มที่ 2</h3>
      <v-card class="mx-auto my-8 card">
        <v-card-text>
          <v-row justify="center">
            <v-col>
              <v-text>รหัส:</v-text>
            </v-col>
            <v-col>
              <v-text>ผู้กรอก: นันท์ณภัทร สอนสุภาพ</v-text>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col>
              <v-text>ร้านค้า: MD</v-text>
            </v-col>
            <v-col>
              <v-text>ชื่อผู้แต่ง: จิตเกษม น้อยไร่ภูมิ</v-text>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col>
              <v-text>ชื่อเรื่อง: หัวไม่ดีก็มีวิธีสอบผ่าน</v-text>
            </v-col>
            <v-col>
              <v-text>ISBN: 9786165786195</v-text>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col>
              <v-text>ปีที่พิมพ์: 2565</v-text>
            </v-col>
            <v-col>
              <v-text>พิมพ์ครั้งที่: 1</v-text>
            </v-col>
            <v-col>
              <v-text>จำนวน: 1 เล่ม</v-text>
            </v-col>
            <v-col>
              <v-text>ราคาสุทธิ: 245 บาท</v-text>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
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

.card {
  width: 100%; /* กำหนดให้กว้างเป็น 80% ของพื้นที่ */
  max-width: 1200px; /* กำหนดความกว้างสูงสุด */
  height: 200px; /* กำหนดความสูงของการ์ด */
  margin: 0 auto; /* จัดตำแหน่งการ์ดให้อยู่กลาง */
  background-color: #ede8dc;
  border-radius: 16px;
}
</style>
