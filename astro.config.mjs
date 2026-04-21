import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv("", process.cwd(), "SANITY_");

export default defineConfig({
  site: "https://www.estudioentre.com.br",
  adapter: vercel(),
  integrations: [
    react(),
    sitemap(),
    sanity({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      useCdn: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },
});
