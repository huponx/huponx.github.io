# Ý tưởng bài viết

Thư mục này lưu **backlog ý tưởng** — không publish lên site. Dùng khi chưa chốt bài thuộc series nào, slug, hay thứ tự publish.

## Phân biệt với `docs/series/`

| | `docs/series/` | `docs/ideas/` |
|---|---|---|
| Mục đích | Chuỗi bài **đã cam kết**: order, slug, trạng thái publish | Ý tưởng chưa hoặc mới chốt hướng viết |
| Khi viết bài | Khớp `series.order`, cập nhật bảng roadmap | **Promote** trước: vào series, standalone, hoặc gộp outline |

Index series: [docs/series/README.md](../series/README.md).

## Chủ đề

| File | Mô tả |
|------|--------|
| [kubernetes.md](kubernetes.md) | Ý tưởng Kubernetes / DevOps |

Thêm file mới theo chủ đề (ví dụ `programming.md`) khi backlog lớn hơn.

## Trạng thái ý tưởng

| Status | Ý nghĩa |
|--------|---------|
| `idea` | Mới ghi, chưa promote |
| `promoted` | Đã đưa vào roadmap series hoặc đang viết draft |
| `done` | Đã publish (bài hoặc section trong bài) |
| `dropped` | Bỏ, không viết |

Ưu tiên tùy chọn: `P1`, `P2` (không bắt buộc).

## Workflow promote

1. Chọn ý tưởng trong file chủ đề → quyết định:
   - **Series part** — thêm/sửa dòng trong `docs/series/*.md` và outline «Nội dung gợi ý».
   - **Standalone** — bài `src/content/blog/{lang}/` không `series`, hoặc phụ lục ngoài bảng order.
   - **Gộp outline** — chỉ bổ sung bullet trong phần `planned` đã có.
2. Tạo hoặc cập nhật draft bài (nếu bắt đầu viết).
3. Đổi `status` ý tưởng → `promoted`; sau publish → `done`.

## Thêm ý tưởng mới

1. Mở file chủ đề phù hợp (hoặc tạo file mới).
2. Thêm một dòng vào bảng: `id`, `status`, `ưu tiên`, `tiêu đề`, `liên quan`.
3. Thêm section `## <id>` với bullet **Gợi ý nội dung** bên dưới.
