---
title: "Caching Tradeoffs in System Design"
description: "Notes on cache hit rate, staleness, and where caching fits in a request path."
pubDate: 2026-05-16
category: "system-design"
tags: ["caching", "scalability"]
lang: "en"
slug: "caching-tradeoffs"
translationKey: "caching-tradeoffs"
---

Caching is a common way to reduce latency, but it changes consistency guarantees.

## Questions to ask

- What happens on a cache miss?
- How stale can data be?
- Who invalidates the cache?

## Practical takeaway

Cache where reads dominate and slightly stale data is acceptable.
