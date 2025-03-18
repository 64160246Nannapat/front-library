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
import { ref, onMounted, watch } from 'vue'
import QRCode from 'qrcode'
import LZString from 'lz-string'

// ตัวแปรเก็บข้อมูลผู้ใช้และ QR Code
const qrCodeDataUrl = ref('')
const userData = ref<any>(null)

// รับข้อมูลจาก props
const props = defineProps({
  user: {
    type: Object,
    required: true,
  }
})

// ฟังก์ชันสร้าง QR Code
const generateQRCode = async () => {
  try {
    let qrText = 'http://bookfair.buu.in.th:8041/mobile'

    if (props.user) {
      // ✅ บีบอัดข้อมูลก่อน encode
      const compressedData = LZString.compressToEncodedURIComponent(JSON.stringify(props.user))
      qrText = `http://bookfair.buu.in.th:8041/mobile?data=${compressedData}`
      console.log('User Data QR Text:', qrText)
    }

    qrCodeDataUrl.value = await QRCode.toDataURL(qrText, {
      color: { dark: '#000000', light: '#ffffff' },
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'L',
    })
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้าง QR Code:', error)
  }
}

onMounted(generateQRCode)

// ตรวจจับการเปลี่ยนแปลงของ userData และอัปเดต QR Code อัตโนมัติ
watch(() => props.user, generateQRCode, { deep: true })
</script>


<style scoped>
img {
  height: auto;
  width: 200px;
}
</style>
