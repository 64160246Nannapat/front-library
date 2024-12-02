<template>
  <v-app>
    <HomeStudent />
    <v-main>
      <v-container>
        <h1>แบบฟอร์มการเสนอซื้อหนังสือ</h1>
        <v-form ref="form" v-model="isFormValid">
          <!-- ฟิลด์: ชื่อหนังสือ -->
          <v-text-field
            v-model="form.title"
            label="ชื่อหนังสือ"
            required
            :rules="[rules.required]"
          ></v-text-field>

          <!-- ฟิลด์: ผู้แต่ง -->
          <v-text-field
            v-model="form.author"
            label="ผู้แต่ง"
            required
            :rules="[rules.required]"
          ></v-text-field>

          <!-- ฟิลด์: หมวดหมู่ -->
          <v-select
            v-model="form.category"
            :items="categories"
            label="หมวดหมู่"
            required
            :rules="[rules.required]"
          ></v-select>

          <!-- ปุ่มส่งฟอร์ม -->
          <v-btn :disabled="!isFormValid" color="primary" @click="submitForm"> ส่งแบบฟอร์ม </v-btn>
        </v-form>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import HomeStudent from '@/components/student/HomeStudent.vue'
import { ref } from 'vue'

const isFormValid = ref(false)

const form = ref({
  title: '',
  author: '',
  category: '',
})

const rules = {
  required: (value: string) => !!value || 'กรุณากรอกข้อมูล',
}

const categories = ['การศึกษา', 'เทคโนโลยี', 'วรรณกรรม', 'วิทยาศาสตร์']

const submitForm = () => {
  if (isFormValid.value) {
    console.log('ส่งฟอร์มสำเร็จ:', form.value)
    // ทำการเชื่อม backend หรือจัดการข้อมูลฟอร์ม
  } else {
    console.log('ฟอร์มไม่สมบูรณ์')
  }
}
</script>

<style scoped>
h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.v-container {
  margin-top: 20px;
}

.v-btn {
  margin-top: 20px;
}
</style>
