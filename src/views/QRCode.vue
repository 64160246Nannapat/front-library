<template>
  <div id="qrcode">
    <canvas ref="qrcodeCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

// สร้างตัวแปร message สำหรับเก็บ URL หรือข้อความที่ต้องการ
const message = ref('http://localhost:5173/book-form-shop')

// ฟังก์ชันในการสร้าง QR Code
const generateQRCode = () => {
  const canvas = document.querySelector('#qrcodeCanvas') as HTMLCanvasElement
  QRCode.toCanvas(
    canvas,
    message.value,
    {
      width: 200,
      color: {
        dark: '#000000',
        light: '#d4f1f9',
      },
    },
    (error) => {
      if (error) console.error(error)
    }
  )
}

// เมื่อ mounted ให้เรียกใช้ฟังก์ชัน generateQRCode
onMounted(() => {
  generateQRCode()
})

// เมื่อค่า message เปลี่ยนแปลง ให้สร้าง QR Code ใหม่
watch(message, generateQRCode)
</script>

<style scoped>
/* สามารถปรับแต่งได้ตามต้องการ */
#qrcode {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  margin: 10px 0;
  padding: 5px;
}

canvas {
  margin-top: 20px;
  border: 1px solid #000;
}
</style>
