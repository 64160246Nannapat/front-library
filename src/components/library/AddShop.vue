<template>
  <v-main style="height: 500px; margin-top: 60px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/addshop.png" alt="Add Shop" />
        <h1>จัดการร้านค้า</h1>
      </div>

      <v-form ref="bookForm" v-model="valid">
        <!-- ชื่อร้านค้า -->
        <div class="form-row">
          <label for="shop">ชื่อร้านค้า<span class="required-asterisk">*</span></label>
          <v-text-field
            id="shop"
            v-model="book.Shop"
            :rules="[rules.required]"
            variant="outlined"
            dense
            class="text-field-top"
          ></v-text-field>
        </div>

        <!-- ชื่อผู้ติดต่อ -->
        <div class="form-row">
          <label for="name">ชื่อผู้ติดต่อ</label>
          <v-text-field
            id="name"
            v-model="book.Name"
            variant="outlined"
            dense
            class="text-field-top"
          ></v-text-field>
        </div>

        <!-- เบอร์โทรศัพท์ -->
        <div class="form-row">
          <label for="phone">เบอร์โทรศัพท์</label>
          <v-text-field
            id="phone"
            v-model="book.Phone"
            variant="outlined"
            dense
            class="text-field-top"
          ></v-text-field>
        </div>

        <!-- อีเมล -->
        <div class="form-row">
          <label for="email">E-mail</label>
          <v-text-field
            id="email"
            v-model="book.Email"
            variant="outlined"
            dense
            class="text-field-top"
          ></v-text-field>
        </div>

        <!-- ปุ่มยืนยัน -->
        <div class="form-row justify-end">
          <v-btn :disabled="!valid" elevation="8" class="confirm-btn" @click="submitForm">
            ยืนยัน
          </v-btn>
        </div>
      </v-form>

      <!-- Dialog ยืนยันการส่งข้อมูล -->
      <v-dialog v-model="dialog" max-width="400px">
        <v-card style="background-color: #eed3d9">
          <v-card-title class="text-center" style="font-weight: bold; font-size: 22px">
            🎉 ส่งข้อมูลสำเร็จ!
          </v-card-title>
          <v-card-text class="text-center" style="font-size: 18px">
            ข้อมูลของคุณถูกส่งเรียบร้อยแล้ว
          </v-card-text>
          <v-card-actions justify-center>
            <v-btn class="btn-dialog" @click="confirmReset"> ตกลง </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'ShopForm',
  setup() {
    const bookForm = ref(null)
    const valid = ref(false)
    const dialog = ref(false)
    const book = ref({
      Shop: '',
      Name: '',
      Phone: '',
      Email: '',
    })

    const rules = {
      required: (value: string) => !!value || 'ต้องกรอกข้อมูล',
      email: (value: string) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'รูปแบบอีเมลไม่ถูกต้อง',
      phone: (value: string) => /^[0-9]{10}$/.test(value) || 'หมายเลขโทรศัพท์ต้องมี 10 หลัก',
    }

    const submitForm = async () => {
      if (bookForm.value) {
        const isValid = await bookForm.value.validate()
        if (isValid) {
          try {
            // await axios.post('http://localhost:3000/', book.value)
            dialog.value = true // แสดง Dialog
          } catch (error) {
            console.error('Error submitting data:', error)
          }
        } else {
          console.error('Validation Failed')
        }
      }
    }

    const confirmReset = () => {
      dialog.value = false // ปิด Dialog
      resetForm()
    }

    const resetForm = () => {
      book.value = {
        Shop: '',
        Name: '',
        Phone: '',
        Email: '',
      }

      if (bookForm.value) {
        bookForm.value.reset() // รีเซ็ตฟอร์ม
      }
    }

    return {
      bookForm,
      valid,
      dialog,
      book,
      rules,
      submitForm,
      confirmReset,
    }
  },
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-image {
  width: 80px;
  height: auto;
  margin-right: 15px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.form-row label {
  min-width: 120px;
  margin-right: 10px;
  font-weight: bold;
}

.confirm-btn {
  font-size: 18px;
  font-weight: bold;
  background-color: #eed3d9;
  color: rgb(0, 0, 0);
}

.text-field-top {
  margin-top: 20px;
  min-height: 50px;
}

.v-text-field,
.v-select {
  flex-grow: 1;
}

.btn-dialog {
  font-size: 16px;
  font-weight: bold; /* ตัวหนา */
  border-radius: 25px; /* ขอบมน */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* เงา */
  background-color: #e0e6f0; /* สีพื้นหลังปุ่ม */
  color: black; /* สีตัวอักษร */
}

.required-asterisk {
  color: red;
  font-size: 16px;
  margin-left: 2px;
}
</style>
