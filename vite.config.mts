import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), basicSsl()],
    server: {
      port: 3001,
      https: env.HTTPS || true,
      host: env.HOST || "localhost",
      open: true,
    },
    build: {
      outDir: "build",
    },
  };
});
