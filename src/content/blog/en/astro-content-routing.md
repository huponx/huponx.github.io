---
title: "Content Collections and Routing in Astro"
description: "Part two of the Astro blog series, covering content collections, slugs, and generated routes."
pubDate: 2026-05-21
category: "web-development"
tags: ["astro", "content-collections", "routing"]
lang: "en"
slug: "astro-content-routing"
translationKey: "astro-content-routing"
series:
  id: "astro-blog"
  title: "Building an Astro Blog"
  order: 2
---

After the basic blog structure is in place, the next step is deciding how posts become pages.

Astro content collections give every Markdown file a schema. That schema keeps frontmatter consistent, so fields like `lang`, `slug`, `category`, and `translationKey` can be trusted by routes and components.

## Routing model

The blog uses static routes with a language prefix:

- `/en/blog/post-slug/`
- `/vi/blog/post-slug/`

Each post controls its public URL through the `slug` field. The route reads all content entries and generates one static page for each published post.
