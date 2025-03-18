# ใช้ base image ของ Node.js
FROM node:18-buster AS build-stage

# กำหนด working directory
WORKDIR /app

# รับค่า ENV_MODE เป็น argument
ARG ENV_MODE=development
ENV NODE_ENV=$ENV_MODE

# คัดลอก package.json และติดตั้ง dependencies
COPY package*.json ./ 
RUN npm install

# คัดลอกโค้ดทั้งหมดเข้า container
COPY . .

# ถ้าเป็น development ให้ติดตั้ง Vue CLI
RUN if [ "$NODE_ENV" = "development" ]; then npm install -g @vue/cli; fi

# ถ้าเป็น production ให้ build แอป
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# ใช้ base image เบากว่าสำหรับ production
FROM node:18-alpine AS production-stage
WORKDIR /app

# รับค่า ENV_MODE เป็น argument
ARG ENV_MODE=development
ENV NODE_ENV=$ENV_MODE

# คัดลอกไฟล์จาก build-stage
COPY --from=build-stage /app /app

# เปิดพอร์ต 8080
EXPOSE 8080

# รันแอปตามโหมด
CMD sh -c "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev -- --host 0.0.0.0 --port 8080; else npm run preview; fi"
