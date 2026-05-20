---
title: "Table of Contents Depth Test"
description: "A test article with multiple heading levels for checking the table of contents layout."
pubDate: 2026-05-20
category: "notes"
tags: ["toc", "markdown", "testing"]
lang: "en"
slug: "table-of-contents-depth-test"
translationKey: "table-of-contents-depth-test"
---

This test post is intentionally structured with several `##` and `###` headings so the table of contents has multiple visible levels.

## Introduction

Use this section to confirm that top-level entries appear as primary items in the table of contents.

### Why this post exists

This article is only for checking the blog layout and table of contents behavior.

### What to verify

Check that second-level items are visually nested under their parent sections.

## Planning the Test

This section gives the table of contents another primary item.

### Desktop behavior

On a wide desktop viewport, the table of contents should appear in the right sidebar.

### Mobile behavior

On mobile and smaller tablet widths, the table of contents should remain in the article flow.

## Content Structure

This section contains more nested headings to make the hierarchy easier to see.

### Heading depth two

This `###` heading should be indented in the table of contents.

### Another nested heading

This gives the same parent section multiple child entries.

#### Deeper heading not shown

This `####` heading is included in the article body, but the current table of contents only renders `##` and `###` headings.

## Final Checks

Use this section near the bottom of the page to test scrolling and sticky sidebar behavior.

### Scroll position

Scroll through the page and verify that the desktop table of contents stays visible.

### Link targets

Click each table of contents item and verify that it jumps to the correct heading.
