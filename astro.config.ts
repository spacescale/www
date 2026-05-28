import mdx from "@astrojs/mdx";
import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import { remarkSoftLineBreaks } from "./src/markdown/remarkSoftLineBreaks";

export default defineConfig({
    site: "https://spacescale.io",
    markdown: {
        remarkPlugins: [remarkSoftLineBreaks],
    },
    integrations: [
        // Enables .md and .mdx content for content pages.
        mdx(),

        // Enables SolidJS components as Astro islands for interactive sections.
        solid(),
    ],
});
