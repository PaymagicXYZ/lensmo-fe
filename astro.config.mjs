import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [react(), tailwind(), image()],
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});
