<template>
  <v-main style="height: 500px; margin-top: 20px">
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
          <v-btn :disabled="!valid" elevation="8" class="confirm-btn" @click="openDialog">
            ยืนยัน
          </v-btn>
        </div>
      </v-form>

      <!-- Dialog ยืนยันการส่งข้อมูล -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card style="background-color: #ede8dc">
          <v-card-title
            class="text-left"
            style="
              font-weight: bold;
              font-size: 18px;
              background-color: #c39898;
              color: black;
              padding: 16px;
              border-bottom-left-radius: 16px;
              border-bottom-right-radius: 16px;
            "
          >
            ยืนยันข้อมูลร้านค้า
          </v-card-title>

          <v-card-text class="text-left" style="font-size: 14px; color: gray">
            <p><strong>ชื่อร้านค้า:</strong> {{ book.Shop }}</p>
            <p><strong>ชื่อผู้ติดต่อ:</strong> {{ book.Name || '-' }}</p>
            <p><strong>เบอร์โทรศัพท์:</strong> {{ book.Phone || '-' }}</p>
            <p><strong>อีเมล:</strong> {{ book.Email || '-' }}</p>
          </v-card-text>

          <v-card-actions class="justify-right">
            <v-btn class="btn-cancel" @click="dialog = false"> ยกเลิก </v-btn>
            <v-btn class="btn-confirm" @click="submitForm"> ยืนยัน </v-btn>
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

    const openDialog = async () => {
      const isValid = await bookForm.value?.validate()
      if (isValid) dialog.value = true
    }

    const submitForm = async () => {
      try {
        // await axios.post('http://localhost:3000/', book.value)
        dialog.value = false
        resetForm()
      } catch (error) {
        console.error('Error submitting data:', error)
      }
    }

    const resetForm = () => {
      book.value = { Shop: '', Name: '', Phone: '', Email: '' }
      bookForm.value?.reset()
    }

    return { bookForm, valid, dialog, book, rules, openDialog, submitForm }
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

.btn-cancel {
  font-size: 16px;
  font-weight: bold;
  border-radius: 25px;
  background-color: #ffaaaa;
  color: black;
  margin-right: end;
}

.btn-confirm {
  font-size: 16px;
  font-weight: bold;
  border-radius: 25px;
  background-color: #aaf0aa;
  color: black;
  margin-right: end;
}

.required-asterisk {
  color: red;
  font-size: 16px;
  margin-left: 2px;
}
</style>
