<template>
  <v-container class="form-container" max-width="600px">
    <div
      class="form-title"
      style="
        background-color: #eed3d9;
        padding: 16px;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      "
    >
      เสนอการซื้อหนังสือ
    </div>
    <v-card-text>
      <div class="form-detail">
        <p>ชื่อ: อาจารย์ วรวิทย์ วีระพันธ์</p>
        <p>สถานะ: อาจารย์</p>
        <p>คณะ: วิทยาการสารสนเทศ</p>
        <p>สาขา: วิทยาการคอมพิวเตอร์</p>
        <p>เบอร์: 0625204648</p>
        <p>Email: werapan@go.buu.ac.th</p>
        <p>ยอดคงเหลือ: 3,000 บาท</p>
      </div>

      <v-form ref="bookForm" v-model="valid" style="margin-top: 50px">
        <v-row dense>
          <v-col cols="12">
            <label for="shop">ชื่อร้านค้า</label>
            <v-text-field
              v-model="book.Shop"
              :rules="[rules.required]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <label for="title">ชื่อหนังสือ<span class="required-asterisk">*</span></label>
            <v-text-field
              v-model="book.Title"
              :rules="[rules.required]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label for="author">ชื่อผู้แต่ง</label>
            <v-text-field v-model="book.Author" variant="outlined" dense></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label for="year">ปีพิมพ์</label>
            <v-text-field v-model="book.Year" variant="outlined" dense></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label for="isbn">ISBN<span class="required-asterisk">*</span></label>
            <v-text-field
              v-model="book.ISBN"
              :rules="[rules.required]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label for="subject">รายวิชา<span class="required-asterisk">*</span></label>
            <v-text-field
              v-model="book.Subject"
              :rules="[rules.required]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label for="price">ราคาสุทธิ<span class="required-asterisk">*</span></label>
            <v-text-field
              v-model="book.Price"
              :rules="[rules.required, rules.number]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <label for="quantity">จำนวนเล่ม<span class="required-asterisk">*</span></label>
            <v-text-field
              v-model="book.Quantity"
              :rules="[rules.required, rules.number]"
              variant="outlined"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <label for="file">ไฟล์</label>
            <v-btn
              @click="triggerFileInput"
              style="
                background-color: #ede8dc;
                border: 1px solid black;
                width: 100%;
                margin-top: 8px;
              "
              class="text-center"
            >
              <v-icon left>mdi-tray-arrow-up</v-icon>
              เลือกรูปภาพหน้าปกและปกใน
            </v-btn>
            <input
              ref="fileInput"
              type="file"
              accept=".xls, .xlsx, .csv"
              style="display: none"
              @change="handleFileChange"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-btn
      style="
        background-color: #eed3d9;
        font-size: 16px;
        font-weight: bold;
        margin-top: 50px;
        width: auto; /* เปลี่ยนเป็น auto เพื่อให้ความยาวตามเนื้อหาภายใน */
        padding: 10px 20px; /* ปรับขนาดให้เหมาะสม */
      "
      block
      large
      @click="submitForm"
      >ยืนยัน</v-btn
    >
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)

const valid = ref(false)
const bookForm = ref(null)
const book = ref({
  Prefix: '',
  Title: '',
  Author: '',
  Year: '',
  ISBN: '',
  Subject: '',
  Shop: '',
  Price: null,
  Quantity: null,
  File: null,
})

const rules = {
  required: (value: string) => !!value || 'กรุณากรอกข้อมูล',
  number: (value: string | null) => {
    if (value === null || value === undefined || value === '') {
      return true
    }
    return /^[0-9]+(\.[0-9]+)?$/.test(value) || 'ต้องเป็นตัวเลขเท่านั้น'
  },
}

const submitForm = () => {
  if (bookForm.value?.validate()) {
    console.log('Form submitted:', book.value)
    bookForm.value.reset()
  } else {
    console.log('Form validation failed')
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0]
    console.log('เลือกไฟล์:', uploadedFile.value.name)
  }
}
</script>

<style scoped>
.form-container {
  background-color: #fdf3f3;
  padding: 20px;
  border-radius: 12px;
}

.form-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.form-detail p {
  margin: 5px 0;
  font-size: 14px;
}

.required-asterisk {
  color: red;
}

.text-center {
  text-align: center;
}
</style>
