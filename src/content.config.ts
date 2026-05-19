import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Astro 6 content collections are configured from the app source root.
// Keep this file at `src/content.config.ts` and keep entries under `src/content`.
const engineering = defineCollection({
    loader: glob({
        pattern: "**/*.{md,mdx}",
        base: "./src/content/engineering",
    }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        authorUrl: z.url().optional(),
        date: z.coerce.date(),
        cardVisual: z.string(),
    }),
});

export const collections = { engineering };
