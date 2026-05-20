---
title: "Deploy Site Tĩnh Bằng GitHub Actions"
description: "Ghi chú về build Astro và publish lên GitHub Pages bằng workflow."
pubDate: 2026-05-18
category: "devops"
tags: ["github-actions", "ci-cd", "github-pages"]
lang: "vi"
slug: "deploy-bang-github-actions"
translationKey: "github-actions-deploy"
---

GitHub Actions có thể build site tĩnh và deploy lên GitHub Pages mà không cần server riêng.

## Cơ bản workflow

- Trigger khi push lên `main`
- Cài dependency bằng `npm ci`
- Build output tĩnh vào `dist/`
- Upload artifact và deploy bằng GitHub Pages actions
