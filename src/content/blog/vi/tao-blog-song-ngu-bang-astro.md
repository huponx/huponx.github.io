---
title: "Tạo Blog Song Ngữ Bằng Astro"
description: "Ghi chú đầu tiên về cách dùng Astro và GitHub Pages để publish một blog công nghệ song ngữ, nhẹ và dễ bảo trì."
pubDate: 2026-05-20
category: "web-development"
tags: ["astro", "github-pages", "static-site", "i18n"]
lang: "vi"
slug: "tao-blog-song-ngu-bang-astro"
translationKey: "building-a-bilingual-astro-blog"
---

Đây là bài viết mẫu đầu tiên cho blog. Mục tiêu là có một nơi để lưu lại ghi chú kỹ thuật, dễ tìm kiếm, dễ chia sẻ, và không quá phức tạp để bảo trì.

Astro phù hợp với mục tiêu này vì mặc định generate HTML tĩnh. GitHub Pages có thể host các file đã build mà không cần server, giúp flow deploy gọn và dễ đoán.

Với nội dung song ngữ, mỗi bài có một file Markdown riêng. Bản tiếng Anh và tiếng Việt được nối với nhau bằng cùng một `translationKey`, nhờ đó site có thể hiển thị nút chuyển ngôn ngữ khi cả hai bản cùng tồn tại.

## Mình muốn lưu gì ở đây

- Ghi chú ngắn từ những điều mình học được.
- Hướng dẫn setup thực tế.
- Các lỗi từng debug và bài học rút ra.
- Bài viết sâu hơn về lập trình, DevOps, database, và system design.
