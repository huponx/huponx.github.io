# Series: Kubernetes từ đầu

| Thuộc tính | Giá trị |
|------------|---------|
| `series.id` | `kubernetes-co-ban` |
| `series.title` | Kubernetes từ đầu |
| Ngôn ngữ | Tiếng Việt (`src/content/blog/vi/`) |
| Trang series | [/vi/series/kubernetes-co-ban/](https://hungp29.github.io/vi/series/kubernetes-co-ban/) |
| Cluster demo | minikube (thống nhất cả series) |

## Trạng thái

| Status | Ý nghĩa |
|--------|---------|
| `published` | Đã có file trong `src/content/blog/vi/`, build OK, không `draft` |
| `draft` | Đang viết hoặc `draft: true` |
| `planned` | Chưa có file; chỉ có trong roadmap |

**Cập nhật file này** mỗi khi publish hoặc đổi slug/title.

---

## Roadmap (12 phần)

Đọc tuần tự theo `order`. Cột **Phụ thuộc** = nên đọc/viết các phần đó trước.

### Cấp 1 — Cơ bản

| Order | Status | Tiêu đề | Slug | URL | Phụ thuộc |
|-------|--------|---------|------|-----|-----------|
| 1 | `published` | Giới thiệu Kubernetes: Pod, Deployment và Service | `gioi-thieu-kubernetes` | [/vi/blog/gioi-thieu-kubernetes/](https://hungp29.github.io/vi/blog/gioi-thieu-kubernetes/) | — |
| 2 | `published` | Kiến trúc cluster Kubernetes: từ cơ bản đến tổng quan production | `kien-truc-cluster-kubernetes` | [/vi/blog/kien-truc-cluster-kubernetes/](https://hungp29.github.io/vi/blog/kien-truc-cluster-kubernetes/) | 1 |
| 3 | `published` | ConfigMap và Secret | `configmap-secret-kubernetes` | [/vi/blog/configmap-secret-kubernetes/](https://hungp29.github.io/vi/blog/configmap-secret-kubernetes/) | 1–2 |

**Nội dung gợi ý**

- **1 (done):** kubectl, Pod, Deployment, Service, demo nginx.
- **2 (done):** Ba level (1/2/3): cluster, control plane/worker, reconciliation, kube-system, static Pod vs Pod qua API, HA/CNI/storage tổng quan.
- **3 (done):** Tách config khỏi image; mount env/volume + `envFrom` prefix; Secret `Opaque`; demo echoserver; rollout restart; teaser checksum/Reloader (chi tiết → idea configmap-rollout).

### Cấp 2 — Trung cấp

| Order | Status | Tiêu đề | Slug | URL | Phụ thuộc |
|-------|--------|---------|------|-----|-----------|
| 4 | `planned` | Ingress: đưa HTTP vào cluster | `ingress-kubernetes` | — | 1, 3 |
| 5 | `planned` | Health check: Liveness và Readiness probe | `probes-kubernetes` | — | 1 |
| 6 | `planned` | Requests, Limits và QoS | `resources-limits-kubernetes` | — | 1 |
| 7 | `planned` | Storage và StatefulSet | `storage-statefulset-kubernetes` | — | 1–2 |

**Nội dung gợi ý**

- **4:** Ingress vs NodePort/LB; Ingress controller (minikube addon); TLS ngắn.
- **5:** HTTP/TCP/exec probes; rolling update an toàn.
- **6:** request/limit; OOMKilled; `kubectl top`.
- **7:** PV, PVC, StorageClass; StatefulSet vs Deployment; demo DB đơn giản.

### Cấp 3 — Nâng cao

| Order | Status | Tiêu đề | Slug | URL | Phụ thuộc |
|-------|--------|---------|------|-----|-----------|
| 8 | `planned` | RBAC và ServiceAccount | `rbac-kubernetes` | — | 2 |
| 9 | `planned` | Horizontal Pod Autoscaler (HPA) | `hpa-kubernetes` | — | 1, 6 |
| 10 | `planned` | Helm: đóng gói và triển khai chart | `helm-kubernetes` | — | 3–7 |

### Cấp 4 — Production

| Order | Status | Tiêu đề | Slug | URL | Phụ thuộc |
|-------|--------|---------|------|-----|-----------|
| 11 | `planned` | Observability: log, event và metric cơ bản | `observability-kubernetes` | — | 1–2 |
| 12 | `planned` | GitOps với Argo CD (hoặc Flux) | `gitops-kubernetes` | — | 1, 10 |

*Có thể gộp 11–12 thành một bài «Production checklist» nếu muốn rút ngắn series.*

---

## Frontmatter chuẩn (bài mới)

```yaml
category: "devops"
lang: "vi"
slug: "<slug-trong-bang>"
translationKey: "<slug-trong-bang>"
series:
  id: "kubernetes-co-ban"
  title: "Kubernetes từ đầu"
  order: <order>
tags: ["kubernetes", ...]
```

File: `src/content/blog/vi/<slug>.md`

---

## Checklist khi publish phần mới

1. Tạo/cập nhật bài Markdown; `series.order` khớp bảng trên.
2. `npm run build` (Node ≥ 22).
3. Cập nhật bảng roadmap: `status` → `published`, điền **URL**.
4. Thêm link từ bài trước tới bài mới (nếu có CTA «phần tiếp theo»).
5. (Tùy chọn) Bản tiếng Anh cùng `translationKey`.

---

## Ngoài series (không ép vào 12 phần)

- Rollout khi ConfigMap/Secret đổi — bài riêng (planned): [configmap-rollout](../ideas/kubernetes.md#configmap-rollout)
- External Secrets / Sealed Secrets — bài riêng (planned): [external-sealed-secrets](../ideas/kubernetes.md#external-sealed-secrets)
- NetworkPolicy sâu, Service Mesh, multi-cluster, operators phức tạp, CKA/CKAD prep.

## Ý tưởng liên quan

Backlog và outline chi tiết (chưa hoặc đã promote): [docs/ideas/kubernetes.md](../ideas/kubernetes.md).

Không nhầm với các dòng `planned` trong bảng roadmap — ý tưởng ở đây là bài standalone hoặc viết sau, không thêm `order` vào bảng 12 phần trừ khi bạn mở rộng series có chủ đích.
