import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 5173,
    proxy: {
      "/api/": {
        target: process.env.VITE_BACK_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
