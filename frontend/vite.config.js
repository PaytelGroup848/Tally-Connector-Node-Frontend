import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/tally-api": {
        target: "https://tallysolutions.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(/^\/tally-api/, "/wp-content/themes/tally/api"),
      },
    },
  },
});
