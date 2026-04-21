import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv("", process.cwd(), "SANITY_");

export default defineConfig({
  site: "https://www.estudioentre.com.br",
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
    define: {
      'import.meta.env.SANITY_PROJECT_ID': JSON.stringify(env.SANITY_PROJECT_ID),
      'import.meta.env.SANITY_DATASET': JSON.stringify(env.SANITY_DATASET),
    },
  },
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },
});
