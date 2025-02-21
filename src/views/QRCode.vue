<template>
  <v-container>
    <v-row justify="center" class="text-center">
      <v-col cols="12" md="6">
        <div v-if="qrCodeDataUrl" class="mt-4">
          <img :src="qrCodeDataUrl" alt="QR Code" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QRCode from 'qrcode'

// ลิงก์เริ่มต้น
const text = ref('https://www.google.com')
const qrCodeDataUrl = ref('')

// ฟังก์ชันสำหรับสร้าง QR Code
const generateQRCode = async () => {
  try {
    // กำหนดตัวเลือกการสร้าง QR Code
    qrCodeDataUrl.value = await QRCode.toDataURL(text.value, {
      color: {
        dark: '#000000', // สีของตัว QR Code
        light: '#ffffff', // สีพื้นหลัง
      },
      width: 300, // ขนาดของ QR Code (ปรับขนาดตามต้องการ)
      margin: 2, // ระยะขอบ
    })
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้าง QR Code:', error)
  }
}

// สร้าง QR Code ทันทีเมื่อโหลดหน้าเว็บ
generateQRCode()
</script>

<style scoped>
img {
  height: auto;
  width: 200px;
}
</style>
