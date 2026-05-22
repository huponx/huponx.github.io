# Ý tưởng: Kubernetes

Index: [README.md](README.md). Roadmap series: [kubernetes-co-ban.md](../series/kubernetes-co-ban.md).

## Bảng ý tưởng

| id | Status | Ưu tiên | Tiêu đề (dự kiến) | Liên quan |
|----|--------|---------|-------------------|-----------|
| [configmap-rollout](#configmap-rollout) | `idea` | P1 | Kubernetes: khi ConfigMap thay đổi thì làm sao để Pod/Deployment rollout lại | **Standalone** — không thuộc series `kubernetes-co-ban` (viết sau) |
| [kinds-overview](#kinds-overview) | `idea` | P2 | Kubernetes: tổng quan các Kind thường gặp | Standalone hoặc phụ lục; overlap nhẹ [phần 1](/vi/blog/gioi-thieu-kubernetes/) |
| [external-sealed-secrets](#external-sealed-secrets) | `idea` | P2 | Kubernetes: External Secrets và Sealed Secrets | **Standalone** — sau Secret cơ bản (series phần 3 hoặc tương đương) |

---

## configmap-rollout

**Tiêu đề:** Kubernetes: khi ConfigMap thay đổi thì làm sao để Pod/Deployment rollout lại

**Promote:** Bài **standalone** (`category: devops`, không `series`). Nên đọc sau khi đã biết ConfigMap/Secret (ví dụ sau series phần 3 hoặc tương đương) — chỉ link chéo, không gộp vào roadmap 12 phần.

**Gợi ý nội dung**

- Mặc định: cập nhật ConfigMap **không** restart Pod; biến môi trường từ ConfigMap thường chỉ có hiệu lực khi Pod được tạo lại.
- Volume mount file: process trong container có thể thấy file đổi trên disk (tùy app có reload hay không).
- Cách thực hành:
  - `kubectl rollout restart deployment/<name> -n <ns>`
  - Annotation checksum trên Pod template (hash nội dung ConfigMap/Secret → Deployment spec đổi → rolling update)
  - Operator [Reloader](https://github.com/stakater/Reloader) (Stakater) — watch ConfigMap/Secret và trigger rollout
- Demo minikube: Deployment + ConfigMap (env + volume) → `kubectl apply` đổi CM → so sánh trước/sau từng cách.
- Ghi chú: Secret tương tự; phân biệt với hot-reload trong app (SIGHUP, inotify) nếu ứng dụng tự hỗ trợ.

**Slug gợi ý:** `configmap-rollout-kubernetes`

---

## kinds-overview

**Tiêu đề:** Kubernetes: tổng quan các Kind thường gặp

**Promote đề xuất:** Bài **standalone** (`category: devops`, không `series.order` trong bảng 12 phần) — bản đồ tham chiếu, không lặp demo nginx của phần 1.

**Gợi ý nội dung**

- **Workload:** Pod, ReplicaSet (ngắn), Deployment, StatefulSet, DaemonSet, Job, CronJob
- **Network:** Service (ClusterIP / NodePort / LoadBalancer), Ingress
- **Config & storage:** ConfigMap, Secret; PV, PVC (pointer series phần 7)
- **Cluster / meta:** Namespace, ServiceAccount; RBAC (pointer series phần 8)
- Bảng một trang: Kind | Mục đích | Khi nào dùng | `kubectl get` phổ biến
- Link ngược tới các phần series 1–12 thay vì dạy sâu từng Kind

**Slug gợi ý:** `kubernetes-kinds-overview`

---

## external-sealed-secrets

**Tiêu đề:** Kubernetes: External Secrets và Sealed Secrets — quản lý Secret an toàn hơn `kubectl create secret`

**Promote:** Bài **standalone** (`category: devops`, không `series`). Không gộp vào phần 3 series (phần 3 chỉ Secret/ConfigMap native); bài này mở rộng GitOps và secret ngoài cluster.

**Gợi ý nội dung**

- **Vấn đề:** Secret trong manifest/Git (base64 không phải mã hóa); secret tĩnh trong repo; rotate thủ công; nhiều cluster/env.
- **Sealed Secrets** ([Bitnami](https://github.com/bitnami-labs/sealed-secrets)): `SealedSecret` CR — mã hóa chỉ cluster có private key mới giải mã được; commit an toàn hơn lên Git; demo `kubeseal`.
- **External Secrets Operator** ([ESO](https://external-secrets.io/)): `ExternalSecret` / `SecretStore` / `ClusterSecretStore` — đồng bộ từ Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, … vào Secret Kubernetes; refresh interval.
- So sánh ngắn: khi nào Sealed Secrets vs ESO vs Secret native + CI inject.
- Demo minikube (chọn một hướng đủ sâu, hướng kia overview):
  - Sealed: controller + seal file + apply → Secret thường xuất hiện.
  - ESO: SecretStore giả lập (ví dụ fake provider / file backend nếu có) hoặc mock + giải thích production dùng Vault/cloud.
- Liên quan GitOps: secret không nằm plaintext trong repo; pointer series phần 12 (Argo CD).
- Không nhầm: Encryption at rest etcd (cluster-level) vs giải pháp bài này (workflow & Git).

**Slug gợi ý:** `external-sealed-secrets-kubernetes`
