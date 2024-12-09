<template>
  <div id="qrcode">
    <h1>สร้าง QR Code</h1>
    <input v-model="message" type="text" placeholder="กรอกข้อความที่ต้องการ" />
    <canvas ref="qrcodeCanvas"></canvas>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'QRCode',
  data() {
    return {
      message: 'https://google.com', // ลิงก์เริ่มต้น
    }
  },
  watch: {
    message: 'generateQRCode',
  },
  mounted() {
    this.generateQRCode()
  },
  methods: {
    generateQRCode() {
      const canvas = this.$refs.qrcodeCanvas
      QRCode.toCanvas(
        canvas,
        this.message,
        {
          width: 200,
          color: {
            dark: '#000000',
            light: '#d4f1f9',
          },
        },
        (error) => {
          if (error) console.error(error)
        },
      )
    },
  },
}
</script>

<style>
/* CSS แบบเดิม */
</style>
