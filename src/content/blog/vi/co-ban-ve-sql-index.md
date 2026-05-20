---
title: "Cơ Bản Về SQL Index Để Query Nhanh Hơn"
description: "Ghi chú ngắn về khi nào index giúp ích và tradeoff của nó."
pubDate: 2026-05-17
category: "database"
tags: ["sql", "indexes", "performance"]
lang: "vi"
slug: "co-ban-ve-sql-index"
translationKey: "sql-index-basics"
---

Index có thể làm đọc nhanh hơn, nhưng cũng tăng chi phí ghi và dung lượng lưu trữ.

## Khi index hữu ích

- Filter thường xuyên trên cùng cột
- Join key dùng lặp lại
- Sort trên cột đã index

## Tradeoff

Nhiều index làm ghi chậm hơn và tốn disk hơn. Hãy bắt đầu từ query pattern thực tế rồi thêm index có chủ đích.
