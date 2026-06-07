import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import { remarkSoftLineBreaks } from "./src/markdown/remarkSoftLineBreaks";

export default defineConfig({
    site: "https://spacescale.io",
    markdown: {
        processor: unified({
            remarkPlugins: [remarkSoftLineBreaks],
        }),
    },
    integrations: [
        // Enables .md and .mdx content for content pages.
        mdx(),

        // Generates the sitemap from the actual route graph so new pages are indexed.
        sitemap(),

        // Enables SolidJS components as Astro islands for interactive sections.
        solid(),
    ],
});
