import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum([
      "claude",
      "web-development",
      "programming",
      "devops",
      "database",
      "system-design",
      "notes",
    ]),
    tags: z.array(z.string()).default([]),
    lang: z.enum(["en", "vi"]),
    slug: z.string(),
    translationKey: z.string(),
    series: z
      .object({
        id: z.string(),
        title: z.string(),
        order: z.number().int().positive(),
      })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
