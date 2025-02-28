# ใช้ base image ของ Node.js สำหรับการติดตั้ง dependencies
FROM node:18-buster AS build-stage

# กำหนด working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json เพื่อ cache dependencies
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมดเข้า container
COPY . .

# สั่งให้ใช้โหมด development (คุณสามารถใช้คำสั่งนี้ในการตั้งค่าโหมด development ในตัวแปรสภาพแวดล้อม)
ENV NODE_ENV=development

# รันคำสั่งให้ติดตั้งเครื่องมือที่ใช้ในการพัฒนา (เช่น Vue CLI, Webpack, หรือ tools อื่น ๆ)
RUN npm install -g @vue/cli

# รันเซิร์ฟเวอร์ในโหมด development พร้อมกำหนด host และ port
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]

# เปิดพอร์ตที่ใช้สำหรับ development (โดยปกติจะเป็น 8080 สำหรับ Vue.js)
EXPOSE 8080
