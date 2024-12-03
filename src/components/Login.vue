<template>
  <v-main class="pink-background">
    <img class="image" src="@/assets/login.png" alt="Login Image" />
    <div class="heading">Book Suggestion for Purchase</div>
  </v-main>
</template>

<script setup lang="ts">
// ไม่มีอะไรใน Script เนื่องจากเป็นหน้าเปล่า
</script>

<style scoped>
.pink-background {
  background-color: #ffe9e5; /* สีชมพู */
  height: 100vh; /* ให้ครอบคลุมทั้งหน้าจอ */
  display: flex; /* ใช้ Flexbox */
  align-items: center; /* จัดให้อยู่กึ่งกลางแนวตั้ง */
  justify-content: center; /* จัดให้อยู่กึ่งกลางแนวนอน */
  position: relative; /* ใช้สำหรับจัดตำแหน่ง */
}

.image {
  position: absolute; /* ตั้งตำแหน่งแบบ Absolute */
  top: 50%; /* ให้อยู่กึ่งกลางแนวตั้ง */
  left: 20px; /* ขยับออกจากขอบซ้าย (เพิ่มระยะห่างจากขอบ) */
  transform: translateY(-50%); /* ปรับให้อยู่กึ่งกลางแนวตั้ง */
  max-width: 1000px; /* เพิ่มขนาดรูปให้ใหญ่ขึ้น */
  height: auto; /* รักษาอัตราส่วนของรูปภาพ */
}

.heading {
  position: absolute; /* ตั้งตำแหน่งแบบ Absolute */
  top: 50%; /* ให้อยู่กึ่งกลางแนวตั้ง */
  left: 50%; /* ให้อยู่กึ่งกลางแนวนอน */
  transform: translate(-50%, -50%); /* ปรับให้กลางหน้าจอ */
  font-size: 32px; /* ขนาดฟอนต์ */
  font-weight: bold; /* ทำให้ฟอนต์หนา */
  color: #333; /* สีของข้อความ */
  text-align: center; /* จัดข้อความให้อยู่กลาง */
  padding-left: 150px; /* เพิ่มระยะห่างจากรูป */
}
</style>
