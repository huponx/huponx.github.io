---
title: "ConfigMap và Secret trong Kubernetes"
description: "Tách cấu hình và dữ liệu nhạy cảm khỏi image: ConfigMap, Secret, mount env và volume, demo trên minikube."
pubDate: 2026-05-24
category: "devops"
tags: ["kubernetes", "configmap", "secret", "kubectl", "devops"]
lang: "vi"
slug: "configmap-secret-kubernetes"
translationKey: "configmap-secret-kubernetes"
series:
  id: "kubernetes-co-ban"
  title: "Kubernetes từ đầu"
  order: 3
---

Đây là **phần 3** trong series *Kubernetes từ đầu*. Ở [phần 1](/vi/blog/intro-kubernetes/) bạn đã deploy **Deployment** và **Service**; [phần 2](/vi/blog/cluster-architecture-kubernetes/) giải thích cluster lưu state qua API và etcd. Bài này tách **cấu hình** và **dữ liệu nhạy cảm** khỏi image container bằng **ConfigMap** và **Secret**.

## Chuẩn bị

- [minikube](https://minikube.sigs.k8s.io/) đang chạy (`minikube start`).
- Namespace `demo` (tạo lại nếu đã xóa sau phần 1):

```bash
kubectl create namespace demo --dry-run=client -o yaml | kubectl apply -f -
kubectl config set-context --current --namespace=demo
```

> Series test trên Kubernetes **1.27+** (`minikube start --kubernetes-version=v1.27.0` trở lên). Field `grpc` probe (phần 5) và `pathType` (phần 4) cần ≥ 1.27.

Các manifest dưới đây dùng `namespace: demo` trừ khi ghi chú khác.

## Vì sao không nhét config vào image?

Hardcode URL, `log_level` hay password trong `Deployment` khiến mỗi môi trường (dev/staging/production) phải **build image khác** hoặc sửa YAML lặp đi lặp lại. Kubernetes khuyến nghị:

- **Image** — code và dependency cố định.
- **ConfigMap** — cấu hình **không nhạy cảm** (URL, file config, feature flag).
- **Secret** — password, token, khóa API, cert (semantic **nhạy cảm**).

Cả hai đều là object trong cluster (lưu qua API/etcd như [phần 2](/vi/blog/cluster-architecture-kubernetes/)), mount vào Pod khi container khởi động.

## ConfigMap — cấu hình không nhạy cảm

### Khái niệm

**ConfigMap** lưu dữ liệu dạng **key–value** hoặc nội dung file (ví dụ đoạn `nginx.conf`):

- URL service, `log_level`, tên theme, đường dẫn file…
- **Không** đặt password, API key hay token vào ConfigMap — dùng **Secret** (ConfigMap vẫn nằm trong etcd, không phải “đã mã hóa an toàn”).

### Tạo ConfigMap

Tạo bằng YAML (declarative, khớp series):

```yaml title="configmap-app.yaml"
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: demo
data:
  message: "Hello from ConfigMap"
```

```bash
kubectl apply -f configmap-app.yaml
kubectl get configmap app-config -o yaml
```

Hoặc một lệnh (imperative, minh họa):

```bash
kubectl create configmap app-config --from-literal=message='Hello from CLI' \
  --dry-run=client -o yaml | kubectl apply -f -
```

### Đưa ConfigMap vào Pod

Hai cách phổ biến:

| Cách | Khi dùng | Ghi chú |
|------|----------|---------|
| `env` / `envFrom` | App đọc **biến môi trường** | `envFrom` nạp mọi key; có **`prefix`** |
| `volume` + `volumeMount` | App đọc **file** | ConfigMap thành file trong container |

#### Biến môi trường

- **`valueFrom.configMapKeyRef`** — một key → một env (đặt tên env tùy ý).
- **`envFrom.configMapRef`** — mọi key trong ConfigMap thành env (tên env = tên key).
- **`prefix`** (trên từng mục `envFrom`): thêm tiền tố vào **tên** env — key `host` + `prefix: DB_` → `DB_host`. Hữu ích khi gộp nhiều ConfigMap tránh trùng tên.
- API Kubernetes **không** có `suffix` trên `envFrom`; cần hậu tố thì đổi tên key trong object hoặc map từng key bằng `env` + `valueFrom`.

Ví dụ chỉ ConfigMap — `envFrom` và prefix:

```yaml
envFrom:
  - configMapRef:
      name: postgres-config
    prefix: POSTGRES_
  - configMapRef:
      name: redis-config
    prefix: REDIS_
```

#### Volume (file)

Mount ConfigMap thành file trong container — phù hợp `nginx.conf`, `.properties`. Có thể chọn key/path bằng `items`, hoặc mount cả thư mục; mount **một** file với `subPath`.

**Lưu ý:** Giá trị env gắn lúc **tạo container**. Đổi ConfigMap **không** tự làm app reload — thường cần `kubectl rollout restart` (chi tiết ở [mục đổi ConfigMap/Secret](#đổi-configmapsecret--rollout-thủ-công-và-auto)).

#### Lab — `env` và `volume`

Một lab, hai bước — khớp hai cách ở bảng trên.

#### Bước 1 — Biến môi trường (`configMapKeyRef`)

Image **echoserver** hiển thị biến môi trường qua HTTP — dễ `curl`. Dùng ConfigMap `app-config` đã tạo ở [Tạo ConfigMap](#tạo-configmap) (`configmap-app.yaml`).

**Service:**

```yaml title="service-echo.yaml"
apiVersion: v1
kind: Service
metadata:
  name: echo
  namespace: demo
spec:
  selector:
    app: echo
  ports:
    - port: 80
      targetPort: 8080
```

**Deployment:**

```yaml title="deployment-echo.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: echo
  namespace: demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: echo
  template:
    metadata:
      labels:
        app: echo
    spec:
      containers:
        - name: echo
          image: registry.k8s.io/e2e-test-images/echoserver:2.5
          ports:
            - containerPort: 8080
          env:
            - name: MESSAGE
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: message
```

Triển khai:

```bash
kubectl apply -f configmap-app.yaml
kubectl apply -f deployment-echo.yaml
kubectl apply -f service-echo.yaml
kubectl get cm,deploy,svc
kubectl rollout status deployment/echo
```

Truy cập (chọn một cách):

```bash
# Port-forward
kubectl port-forward svc/echo 8080:80
curl -s http://127.0.0.1:8080/ | head -20

# Hoặc minikube service
minikube service echo -n demo --url
```

Response chứa biến `MESSAGE=Hello from ConfigMap`.

**Đổi config và restart:**

```bash
kubectl patch configmap app-config -n demo \
  --type merge -p '{"data":{"message":"Updated from ConfigMap"}}'
kubectl rollout restart deployment/echo
kubectl rollout status deployment/echo
curl -s http://127.0.0.1:8080/   # sau port-forward; thấy MESSAGE mới
```

Nếu chỉ `patch` ConfigMap mà **không** restart, Pod cũ vẫn giữ env cũ.

#### Bước 2 — File config (`volume` + `volumeMount`)

[Phần 1](/vi/blog/intro-kubernetes/) dùng nginx — mount file config thay vì bake vào image. Khai báo `volumes` (nguồn ConfigMap) và `volumeMounts` (gắn vào container); mỗi key trong `data` thành **một file** trong thư mục mount:

```yaml title="configmap-nginx-conf.yaml"
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-sidecar-conf
  namespace: demo
data:
  custom.conf: |
    server {
      listen 8080;
      location / {
        return 200 'Config from ConfigMap volume\n';
        add_header Content-Type text/plain;
      }
    }
```

```yaml title="deployment-nginx-configmap.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-config
  namespace: demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-config
  template:
    metadata:
      labels:
        app: nginx-config
    spec:
      volumes:
        - name: nginx-conf
          configMap:
            name: nginx-sidecar-conf
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 8080
          volumeMounts:
            - name: nginx-conf
              mountPath: /etc/nginx/conf.d
              readOnly: true
```

```bash
kubectl apply -f configmap-nginx-conf.yaml
kubectl apply -f deployment-nginx-configmap.yaml
kubectl rollout status deployment/nginx-config
kubectl exec deploy/nginx-config -- curl -s http://127.0.0.1:8080/
```

Kết quả mong đợi: `Config from ConfigMap volume`. Image nginx mặc định vẫn có thể listen cổng 80; file từ ConfigMap thêm server **8080** — pattern này tách **file config** khỏi image. Muốn chỉ mount **một** file mà không ghi đè cả thư mục, dùng `subPath: custom.conf` cùng `mountPath: /etc/nginx/conf.d/custom.conf`.

## Secret — dữ liệu nhạy cảm

### Khái niệm

**Secret** dùng cùng cơ chế **env** / **volume** như ConfigMap, nhưng dành cho dữ liệu **nhạy cảm**: password DB, token, khóa API, cert TLS.

| | ConfigMap | Secret |
|---|-----------|--------|
| Nội dung | Cấu hình không nhạy cảm | Password, token, khóa API… |
| `kubectl get` | Thường thấy giá trị | Ẩn giá trị (mặc định) |
| Type | — | **`Opaque`** (generic; mặc định) |

**`type: Opaque`** — loại **generic** (mặc định nếu bỏ `type`): cặp key/value **tùy ý** do bạn định nghĩa. Khác `kubernetes.io/tls` (cert + key cho Ingress — [phần 4](/vi/blog/ingress-kubernetes/)) hay `kubernetes.io/dockerconfigjson` (pull image registry riêng).

Production thường dùng **External Secrets** / **Sealed Secrets** — ngoài phạm vi series này.

### Tạo Secret

Secret lưu từng giá trị dưới dạng **cặp key → nội dung**. Trong file YAML bạn gặp hai cách khai báo:

| Trong file YAML của bạn | Ý nghĩa |
|-------------------------|---------|
| **`stringData`** | Ghi **chuỗi đọc được** — ví dụ `password: "demo-password-123"`. Tiện khi viết tay hoặc demo. |
| **`data`** | Ghi **đã mã hóa base64** — ví dụ `password: ZGVtby1wYXNzd29yZC0xMjM=`. Thường thấy khi `kubectl get secret -o yaml` export lại. |

Khi `kubectl apply` manifest có **`stringData`**, API server **tự chuyển** sang `data` (base64) trước khi lưu vào cluster — bạn không cần tự encode.

**Base64 là gì ở đây?** Chỉ là cách **đóng gói** ký tự để lưu trong YAML/etcd (giống “ghi lại cho an toàn ký tự đặc biệt”), **không** phải mã hóa bí mật. Ai đọc được object Secret trong cluster vẫn **decode** và thấy password. Vì vậy **không** commit secret thật lên Git.

Bài này dùng **`stringData`** cho dễ đọc:

```yaml title="secret-db.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
  namespace: demo
type: Opaque
stringData:
  password: "demo-password-123"   # giá trị giả, chỉ cho lab
```

```bash
kubectl apply -f secret-db.yaml
kubectl get secret db-credentials
# kubectl không in giá trị password ra terminal (mặc định)

kubectl get secret db-credentials -o yaml
# Trong cluster, bạn sẽ thấy field data.password dạng base64 — không còn stringData
```

Cách khác — tạo trực tiếp bằng CLI (không cần file `secret-db.yaml` trong repo):

```bash
kubectl create secret generic db-credentials \
  --from-literal=password='demo-password-123' \
  -n demo --dry-run=client -o yaml | kubectl apply -f -
```

**Không** commit secret production lên Git.

### Đưa Secret vào Pod

| Cách | Khi dùng | Ghi chú |
|------|----------|---------|
| `env` / `envFrom` | App đọc **biến môi trường** | `secretKeyRef` / `secretRef`; có **`prefix`** |
| `volume` + `volumeMount` | App đọc **file** (cert, key…) | `volumes[].secret` |

#### Biến môi trường

Cùng chỗ trong manifest (`containers[].env` / `envFrom` → `valueFrom`). Field **đối xứng** với ConfigMap:

| ConfigMap | Secret |
|-----------|--------|
| `configMapKeyRef` | `secretKeyRef` |
| `configMapRef` (trong `envFrom`) | `secretRef` (trong `envFrom`) |

- **`valueFrom.secretKeyRef`** — một key trong Secret → một env (đặt tên env tùy ý, ví dụ `DB_PASSWORD` từ key `password`).
- **`envFrom.secretRef`** — mọi key trong Secret thành env (tên env = tên key); có thể kèm **`prefix`** như `configMapRef`.

Gộp ConfigMap và Secret trong một `envFrom`:

```yaml
          envFrom:
            - configMapRef:
                name: app-config
            - secretRef:
                name: db-credentials
              prefix: DB_
```

Key `password` trong Secret → env `DB_password`.

#### Volume (file)

Mount Secret thành file trong container — `volumes[].secret.secretName` + `volumeMounts`; mỗi **key** trong Secret thành **một file** (tên file = tên key). Pattern giống ConfigMap volume; hay dùng cho TLS cert/key (Ingress, phần 4).

```yaml
      volumes:
        - name: db-secret
          secret:
            secretName: db-credentials
      containers:
        - name: app
          volumeMounts:
            - name: db-secret
              mountPath: /etc/secrets
              readOnly: true
```

File `/etc/secrets/password` chứa giá trị key `password` (kubelet decode base64 khi ghi file).

#### Lab — `env` và `volume`

##### Bước 1 — Biến môi trường (`secretKeyRef`)

Bổ sung Secret vào Deployment `echo` (sau [lab ConfigMap bước 1](#bước-1--biến-môi-trường-configmapkeyref); file `deployment-echo.yaml` đã có `MESSAGE`). Ví dụ một key — **`secretKeyRef`**:

```yaml
          env:
            - name: MESSAGE
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: message
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: password
```

```bash
kubectl apply -f secret-db.yaml
kubectl apply -f deployment-echo.yaml
kubectl rollout status deployment/echo
kubectl exec deploy/echo -- env | grep -E 'MESSAGE|DB_PASSWORD'
```

Lệnh `kubectl exec ... env` trên máy bạn có thể in ra `DB_PASSWORD=demo-password-123`. **Cẩn thận** khi làm với secret thật ở production.

Nếu Secret có **nhiều key** và bạn muốn đưa hết vào container thành biến môi trường, dùng **`envFrom.secretRef`** (và `prefix` nếu cần) thay vì liệt kê từng `secretKeyRef` — xem ví dụ YAML trong mục [Đưa Secret vào Pod](#đưa-secret-vào-pod).

##### Bước 2 — File (`volume` + `volumeMount`)

Dùng lại Secret `db-credentials` ([Tạo Secret](#tạo-secret)). Deployment **busybox** để `cat` file mount:

```yaml title="deployment-secret-volume.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secret-file
  namespace: demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: secret-file
  template:
    metadata:
      labels:
        app: secret-file
    spec:
      volumes:
        - name: db-secret
          secret:
            secretName: db-credentials
      containers:
        - name: shell
          image: busybox:1.36
          command: ["sleep", "infinity"]
          volumeMounts:
            - name: db-secret
              mountPath: /etc/secrets
              readOnly: true
```

```bash
kubectl apply -f secret-db.yaml    # nếu chưa apply ở bước 1
kubectl apply -f deployment-secret-volume.yaml
kubectl rollout status deployment/secret-file
kubectl exec deploy/secret-file -- cat /etc/secrets/password
```

Kết quả mong đợi: `demo-password-123` (giá trị demo trong `secret-db.yaml`).

Chỉ mount **một** file (không ghi đè cả thư mục):

```yaml
          volumeMounts:
            - name: db-secret
              mountPath: /etc/secrets/password
              subPath: password
              readOnly: true
```

Đổi Secret vẫn có thể cần **restart Pod** nếu app đọc file lúc khởi động — tương tự env (xem [rollout](#đổi-configmapsecret--rollout-thủ-công-và-auto)).

## Hai field tiện ích: immutable và optional

### immutable — khóa CM/Secret để bảo vệ và giảm tải

**`immutable: true`** (K8s 1.21+) đánh dấu ConfigMap/Secret **không thể sửa nội dung**; muốn đổi phải **tạo object mới** (ví dụ `app-config-v2`) rồi update Deployment trỏ sang. Hai lợi ích:

- **Giảm tải API/etcd:** kubelet thường **watch** từng CM/Secret được mount để phát hiện thay đổi. Với object `immutable`, kubelet **bỏ qua watch** — cluster lớn (hàng nghìn Pod) tiết kiệm đáng kể.
- **An toàn:** tránh ai đó `kubectl edit configmap app-config` rồi gây rớt service.

```yaml title="configmap-immutable.yaml"
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config-v2
  namespace: demo
immutable: true
data:
  message: "Frozen value"
```

Lưu ý: đã set `immutable: true` rồi **không** thể quay lại sửa — phải `kubectl delete` và tạo lại. Phù hợp với config gắn version trong tên object (`app-config-v1`, `app-config-v2`).

### optional — tránh CrashLoopBackOff khi key thiếu

Mặc định nếu Pod tham chiếu một ConfigMap/Secret hoặc key **không tồn tại**, container sẽ **không start** (status `CreateContainerConfigError`). Trong nhiều trường hợp, ta muốn Pod vẫn chạy với env không được set — dùng **`optional: true`** trên `configMapKeyRef`, `secretKeyRef`, `configMapRef`, hoặc `secretRef`:

```yaml
env:
  - name: FEATURE_FLAG
    valueFrom:
      configMapKeyRef:
        name: app-config
        key: feature-x
        optional: true
```

Khi `app-config` hoặc key `feature-x` chưa có, `FEATURE_FLAG` đơn giản không tồn tại trong container — app cần tự xử lý default.

Dùng cho config **không bắt buộc** (feature flag mới, override nâng cao); **không** dùng cho password hay endpoint chính — nếu thiếu thì để Pod fail rõ ràng vẫn tốt hơn chạy với cấu hình thiếu.

## Đổi ConfigMap/Secret — rollout thủ công và auto

### Mặc định: không auto rollout

Cập nhật ConfigMap hoặc Secret qua `kubectl apply` **không** tự rolling update Deployment.

| Cách mount | Sau khi đổi CM/Secret |
|------------|------------------------|
| **Env** | Pod đang chạy giữ env cũ đến khi container tạo lại |
| **Volume (file)** | kubelet **sync** file mount theo chu kỳ (thường vài chục giây, có thể ~1 phút — không sync ngay khi `apply`); app **có thể không** đọc lại file đã đổi — đừng giả định nginx tự reload |

**Secret** đổi password: app đọc env lúc start vẫn cần **restart Pod**.

### Cách làm trong lab

```bash
kubectl patch configmap app-config -n demo --type merge \
  -p '{"data":{"message":"New value"}}'
kubectl rollout restart deployment/echo -n demo
```

### Auto rollout — giới thiệu (không lab trên minikube)

Kubernetes **không** bật sẵn “auto rollout khi ConfigMap đổi”. Production thường:

| Cách | Ý tưởng |
|------|---------|
| **Checksum annotation** | Hash nội dung CM/Secret gắn Pod template → đổi CM làm Deployment spec đổi → rolling update |
| **Reloader** (operator) | Watch CM/Secret, trigger `rollout restart` |
| **Hot-reload trong app** | **Ứng dụng** tự đọc lại file khi đổi (nginx `reload`, inotify…) — Kubernetes **không** bật sẵn; phụ thuộc app bạn chạy |

### Best practices — ConfigMap/Secret

Thói quen nên áp dụng khi thiết kế manifest và vận hành:

- Một ConfigMap/Secret, **nhiều Pod** — dùng chung `envFrom` hoặc volume thay vì copy YAML lặp lại.
- Nhiều nguồn `envFrom` — dùng **`prefix`** để tránh trùng tên biến môi trường.
- Phân quyền **RBAC**: hạn chế ai được `get/list secret` (chi tiết ở phần RBAC trong series).
- Secret thật: không commit Git; ưu tiên External Secrets / Sealed Secrets ở production.

### Lỗi thường gặp

- **`CreateContainerConfigError`**: sai tên ConfigMap/Secret hoặc tên **key** — xem `kubectl describe pod` → Events.
- Đổi ConfigMap/Secret rồi **quên `rollout restart`** (với env) → Pod vẫn dùng config cũ, tưởng “apply không ăn”.
- Mount volume: tưởng file đổi **ngay** sau `apply` — thực tế kubelet sync trễ; app có thể không reload file.

## Demo end-to-end

1. `kubectl create namespace demo` (nếu chưa có) và set context.
2. Lab ConfigMap: `configmap-app.yaml` → echo (`deployment-echo.yaml`, `service-echo.yaml`) → nginx volume (`configmap-nginx-conf.yaml`, `deployment-nginx-configmap.yaml`).
3. Lab Secret: `secret-db.yaml` → `deployment-echo.yaml` (env) → `deployment-secret-volume.yaml` (file).
4. Verify HTTP/env; patch ConfigMap → `rollout restart` → verify lại.
5. Dọn: `kubectl delete namespace demo` (xóa toàn bộ object trong lab)

## Tổng kết

| Resource | Vai trò |
|----------|---------|
| ConfigMap | Cấu hình không nhạy cảm; env hoặc file |
| Secret | Dữ liệu nhạy cảm; thường `type: Opaque` |
| `envFrom` + `prefix` | Nạp nhiều key; tránh trùng tên env |
| Rollout | Đổi CM/Secret → thường cần restart Pod; auto cần checksum/Reloader |

Bạn đã tách config khỏi image — bước nền trước **Ingress** (expose HTTP) và GitOps sau này.

### Tiếp theo trong series

**Phần 4** — [Ingress: đưa HTTP vào cluster](/vi/blog/ingress-kubernetes/): routing HTTP từ ngoài vào Service qua Ingress Controller.

### Tham khảo

- [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Define environment variables](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)
- [Distribute credentials secure](https://kubernetes.io/docs/tasks/inject-data-application/distribute-credentials-secure/)
- [Stakater Reloader](https://github.com/stakater/Reloader)
