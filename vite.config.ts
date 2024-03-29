import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: "./build",
    },
    css: {
        preprocessorOptions: {
            additionalData: '@import "src/assets/styles/var.scss";',
        },
    },
    plugins: [react()],
});
