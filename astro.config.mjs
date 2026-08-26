import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  site: "https://diegolu7.github.io",
  base: "/sestre",
  integrations: [react()],
  vite: {
    plugins: [tailwind()],
  },
});
