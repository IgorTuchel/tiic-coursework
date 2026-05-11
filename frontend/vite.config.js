import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

export default defineConfig({
    plugins: [tailwindcss(), react()],
    server: {
        host: "0.0.0.0", // listen on all interfaces
        port: 5173,
        allowedHosts: true, // allow ngrok's hostname
        hmr: {
            clientPort: 443, // ngrok terminates HTTPS on 443
        },
        proxy: {
            "/api": {
                target: process.env.VITE_BACKEND_URL || "http://localhost:3000",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
