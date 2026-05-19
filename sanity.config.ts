import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schema";

export default defineConfig({
  name: "default",
  title: "Estúdio Entre",

  projectId: process.env.SANITY_PROJECT_ID || "7a0ee11t",
  dataset: "production",

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
