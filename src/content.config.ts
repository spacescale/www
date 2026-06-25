import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { authorIds } from "./markdown/authors";

const blog = defineCollection({
    loader: glob({
        pattern: "**/*.{md,mdx}",
        base: "./src/content/blog",
    }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.enum(authorIds),
        date: z.coerce.date(),
        category: z.string().optional(),
    }),
});

export const collections = { blog };
