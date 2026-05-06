import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import solid from "@astrojs/solid-js";

export default defineConfig({
  integrations: [
    // Enables .md and .mdx content for content pages.
    mdx(),

    // Enables SolidJS components as Astro islands for interactive sections.
    solid(),
  ],
});
