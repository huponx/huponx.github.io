---
title: "Deploying Static Sites with GitHub Actions"
description: "Notes on building Astro output and publishing to GitHub Pages with a workflow."
pubDate: 2026-05-18
category: "devops"
tags: ["github-actions", "ci-cd", "github-pages"]
lang: "en"
slug: "github-actions-deploy"
translationKey: "github-actions-deploy"
---

GitHub Actions can build a static site and deploy it to GitHub Pages without a separate server.

## Workflow basics

- Trigger on push to `main`
- Install dependencies with `npm ci`
- Build static output into `dist/`
- Upload artifact and deploy with GitHub Pages actions

```yaml title=".github/workflows/deploy.yml"
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
```
