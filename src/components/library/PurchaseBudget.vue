<template>
  <v-container>
    <v-card class="pa-5" outlined>
      <v-row class="d-flex align-center">
        <v-col cols="6">
          <h2 class="font-weight-bold">ประมาณงบการซื้อหนังสือ</h2>
        </v-col>
        <v-col cols="3">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="selectedDate"
                label="เลือกวันที่"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="selectedDate" @input="dateMenu = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="3">
          <v-select
            :items="statuses"
            v-model="selectedStatus"
            label="สถานะ"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-select
            :items="faculties"
            v-model="selectedFaculty"
            label="คณะ"
          ></v-select>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="books"
        item-value="index"
        dense
        class="elevation-1"
      >
        <template v-slot:top>
          <v-row>
            <v-col>
              <h3 class="text-h5">ข้อมูลหนังสือ</h3>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
      <v-divider></v-divider>
      <v-row class="d-flex justify-space-between mt-3">
        <v-col class="text-right">
          <p>รวม</p>
        </v-col>
        <v-col class="text-left">
          <p>{{ total.price }} บาท</p>
          <p>{{ total.quantity }} เล่ม</p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      dateMenu: false,
      selectedDate: "23/11/2024",
      selectedStatus: "ทั้งหมด",
      selectedFaculty: "ทั้งหมด",
      statuses: ["ทั้งหมด", "มีผู้จอง", "ไม่มีผู้จอง"],
      faculties: ["ทั้งหมด", "วิทยาการสารสนเทศ", "อื่น ๆ"],
      headers: [
        { text: "ลำดับ", value: "index" },
        { text: "ชื่อผู้คัดเลือก", value: "name" },
        { text: "คณะ", value: "faculty" },
        { text: "ข้อมูลหนังสือ", value: "book" },
        { text: "ร้านค้า", value: "store" },
        { text: "ราคา (บาท)", value: "price" },
        { text: "จำนวน (เล่ม)", value: "quantity" },
        { text: "สถานะ", value: "status" },
      ],
      books: [
        {
          index: 1,
          name: "นันท์ณภัทร สอนสุขภาพ",
          faculty: "วิทยาการสารสนเทศ",
          book: "ปริญจ์จำนาน",
          store: "แจ่มใส",
          price: 415,
          quantity: 1,
          status: "มีผู้จอง",
        },
        {
          index: 2,
          name: "นวพรรณ สีหบุตร",
          faculty: "วิทยาการสารสนเทศ",
          book: "หัวไม่มีดีก็มีวิธีสอบผ่าน",
          store: "MD",
          price: 245,
          quantity: 1,
          status: "ไม่มีผู้จอง",
        },
      ],
    };
  },
  computed: {
    total() {
      const price = this.books.reduce((sum, book) => sum + book.price, 0);
      const quantity = this.books.reduce((sum, book) => sum + book.quantity, 0);
      return { price, quantity };
    },
  },
});
</script>

<style scoped>
.text-right {
  text-align: right;
}
.text-left {
  text-align: left;
}
</style>

