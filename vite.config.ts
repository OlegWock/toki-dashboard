import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '127.0.0.1',
    },
    plugins: [react()],
    resolve: {
        alias: {
            '@components': resolve(__dirname, './src/components'),
            '@utils': resolve(__dirname, './src/utils'),
            '@assets': resolve(__dirname, './src/assets'),
        },
    },
});
