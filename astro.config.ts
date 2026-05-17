import mdx from "@astrojs/mdx";
import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";

export default defineConfig({
    integrations: [
        // Enables .md and .mdx content for content pages.
        mdx(),

        // Enables SolidJS components as Astro islands for interactive sections.
        solid(),
    ],
});
