import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import components from "unplugin-vue-components/vite";
import vueDevTools from "vite-plugin-vue-devtools";
import { VarletImportResolver } from "@varlet/import-resolver";

export default defineConfig({
  plugins: [
    vue(),
    components({
      resolvers: [VarletImportResolver()],
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
  },
  build: {
    outDir: "./dist",
  },
  define: {
    __BUILD_TIME: new Date().getTime(),
  },
});
