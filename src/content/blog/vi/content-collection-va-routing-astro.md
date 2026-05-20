---
title: "Content Collection Và Routing Trong Astro"
description: "Phần hai của series Astro blog, nói về content collection, slug, và generated routes."
pubDate: 2026-05-21
category: "web-development"
tags: ["astro", "content-collections", "routing"]
lang: "vi"
slug: "content-collection-va-routing-astro"
translationKey: "astro-content-routing"
series:
  id: "astro-blog"
  title: "Xây Dựng Blog Bằng Astro"
  order: 2
---

Sau khi có cấu trúc blog cơ bản, bước tiếp theo là quyết định cách bài viết trở thành page.

Astro content collections cho mỗi file Markdown một schema. Schema này giúp frontmatter nhất quán, nên các field như `lang`, `slug`, `category`, và `translationKey` có thể được route và component tin cậy.

## Mô hình routing

Blog dùng static routes với prefix ngôn ngữ:

- `/en/blog/post-slug/`
- `/vi/blog/post-slug/`

Mỗi bài kiểm soát URL public qua field `slug`. Route đọc toàn bộ content entries và generate một static page cho mỗi bài đã publish.
