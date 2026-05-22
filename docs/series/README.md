# Series — roadmap bài viết

Thư mục này lưu **kế hoạch chuỗi bài** (order, slug, trạng thái publish) — không publish lên site.

## Danh sách series

| Series | File | `series.id` |
|--------|------|-------------|
| Kubernetes từ đầu | [kubernetes-co-ban.md](kubernetes-co-ban.md) | `kubernetes-co-ban` |

## Ý tưởng chưa chốt series

Backlog ý tưởng lẻ hoặc chưa có order: [docs/ideas/README.md](../ideas/README.md).

Ví dụ chủ đề K8s: [docs/ideas/kubernetes.md](../ideas/kubernetes.md).

## Khi publish phần mới

1. Đọc roadmap series (Phụ thuộc, Nội dung gợi ý).
2. Tạo `src/content/blog/vi/<slug>.md` với `series.order` khớp bảng.
3. `npm run build` (Node ≥ 22.12).
4. Cập nhật bảng: `status` → `published`, điền URL.

Chi tiết: `.cursor/rules/series-roadmap.mdc`, skill `write-blog-post`.
