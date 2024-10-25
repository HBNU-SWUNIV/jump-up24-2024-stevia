import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/stevia',
    server: {
        port: 3000,
        host: "192.168.30.63",
        hmr: {
            clientPort: 3000,
            overlay: false
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                nested: resolve(__dirname, 'index.html')
            }
        }
    }
});