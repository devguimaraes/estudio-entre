import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
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
      projectId: env.SANITY_PROJECT_ID || "7a0ee11t",
      dataset: env.SANITY_DATASET || "production",
      useCdn: false,
      studioBasePath: "/studio",
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    service: { entrypoint: "astro/assets/services/noop" },
  },
});
