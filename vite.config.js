import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
    assetsInclude: ['/*.ttf', '/.woff', '**/.woff2'],
    plugins: [
        vue(),
        vueJsx(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@layouts': path.resolve(__dirname, './src/layouts'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://info.lib.buu.ac.th',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '/apilib/Walai/CheckSearch'),
            },
        },
        host: '0.0.0.0',  // ช่วยให้สามารถเข้าถึงจากทุกๆ IP
        allowedHosts: ['bookfair.buu.in.th', 'localhost'],  // เพิ่ม host นี้เพื่ออนุญาตให้เข้าถึงได้
        port: 8080,  // ตั้งค่าให้ใช้พอร์ต 8080
        hmr: {
            clientPort: 8044,  // ✅ ใช้พอร์ตเดียวกับ Docker
        },
        watch: {
            usePolling: true,  // ✅ จับการเปลี่ยนแปลงไฟล์ใน Docker
        },
    },
    build: {
        rollupOptions: {
            external: ['jquery'] // เพิ่มการตั้งค่าตรงนี้
        }
    }
});
