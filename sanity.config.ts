import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schema";

export default defineConfig({
  name: "default",
  title: "Estúdio Entre",

  projectId: import.meta.env.SANITY_PROJECT_ID || "",
  dataset: import.meta.env.SANITY_DATASET || "production",

  plugins: [
    structureTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
