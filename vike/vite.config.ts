import vue from "@vitejs/plugin-vue";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/vike-vue-content/",
  plugins: [vike(), vue()],
});
