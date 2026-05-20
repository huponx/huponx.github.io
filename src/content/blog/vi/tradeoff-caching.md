---
title: "Tradeoff Của Caching Trong System Design"
description: "Ghi chú về hit rate, độ cũ dữ liệu, và vị trí cache trong request path."
pubDate: 2026-05-16
category: "system-design"
tags: ["caching", "scalability"]
lang: "vi"
slug: "tradeoff-caching"
translationKey: "caching-tradeoffs"
---

Cache là cách phổ biến để giảm latency, nhưng nó cũng thay đổi đảm bảo consistency.

## Câu hỏi cần hỏi

- Cache miss xử lý thế nào?
- Dữ liệu có thể cũ đến mức nào?
- Ai invalidate cache?

## Kết luận thực tế

Cache ở nơi đọc nhiều và chấp nhận dữ liệu hơi cũ.
