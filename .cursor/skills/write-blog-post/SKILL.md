---
name: write-blog-post
description: >-
  Writes and edits Hung Blog (Astro) posts in src/content/blog with correct
  frontmatter, bilingual translationKey pairing, series metadata, and docs/series
  roadmap updates, and docs/ideas backlog. Use when the user asks to write a blog
  post, draft an article, add a translation, publish a series part, capture a
  post idea, or update kubernetes/series content.
---

# Write Hung Blog post

Astro static blog. Posts: `src/content/blog/en/`, `src/content/blog/vi/`. Schema: `src/content.config.ts`. Full templates: [reference.md](reference.md).

Apply project rules when editing: `.cursor/rules/blog-posts.mdc`, `.cursor/rules/series-roadmap.mdc`, `.cursor/rules/blog-ideas.mdc`.

## A. Single-language post

```
- [ ] lang, category, slug, translationKey decided
- [ ] File created: src/content/blog/{lang}/{slug}.md
- [ ] Body: intro → ## sections → runnable code/commands
- [ ] npm run build passes
```

1. Pick `lang` (`en` or `vi`), `category`, kebab-case `slug`.
2. Set `translationKey` (usually same as slug for standalone posts).
3. Create `src/content/blog/{lang}/{slug}.md` using [reference.md](reference.md) template.
4. Write content; open with 1–2 sentences; use `##` for main sections.
5. Run `npm run build` (Node ≥ 22.12). Fix Zod/schema errors in frontmatter.

## B. Bilingual pair (en + vi)

```
- [ ] First version written
- [ ] Second file in other lang folder
- [ ] Same translationKey on both
- [ ] title, description, body translated; series.title localized
- [ ] npm run build passes
```

1. Write the first language version.
2. Create the other at `src/content/blog/{other-lang}/{localized-slug}.md`.
3. Keep **identical** `translationKey`; change `slug`, `title`, `description`, and body.
4. If `series` is set: same `series.id` and `series.order`; translate `series.title`.
5. Build validate both files.

## C. New idea (backlog)

```
- [ ] Topic file chosen (e.g. docs/ideas/kubernetes.md)
- [ ] Row added to ideas table + ## section with Gợi ý nội dung
- [ ] status = idea (or promoted if merged into series outline)
```

1. Add to `docs/ideas/` — index: `docs/ideas/README.md`.
2. On promote: update `docs/series/*.md` and/or start draft; set idea `status` → `promoted`, then `done` after publish.

## D. Series part

```
- [ ] Roadmap read (order, slug, dependencies, content hints)
- [ ] series block matches roadmap order
- [ ] Opening line: "Part N" in series
- [ ] npm run build
- [ ] Roadmap table updated (published + URL)
- [ ] Optional link from previous part
```

1. Open roadmap under `docs/series/` (index: `docs/series/README.md`). Check `docs/ideas/` for promoted outlines.
2. Use planned `slug`, `order`, and **Nội dung gợi ý**; respect **Phụ thuộc**.
3. Add frontmatter `series` block; start body with part N in series (see sample: `src/content/blog/vi/gioi-thieu-kubernetes.md`).
4. After publish: update roadmap `status` → `published`, fill URL `/vi/blog/{slug}/` or `/en/blog/{slug}/`.
5. Optionally link “next part” from the previous post.

## E. Draft

Use `draft: true` while composing. Drafts are excluded from listings and routes. Remind the user to remove `draft` before going live.

## F. Mermaid and cache

- Diagrams: fenced block with language `mermaid` (rendered at build time).
- First-time setup: `npm run setup:diagrams`
- Diagram missing in dev: `rm -rf .astro` then `npm run dev`, or `npm run dev:fresh`
- Stale posts after delete: `rm -rf .astro dist` then rebuild

Details: [reference.md](reference.md).

## Writing style

- **vi**: Clear; **bold** key terms on first use; concise paragraphs.
- **en**: Natural equivalent, not literal word-for-word.
- Technical flow: why (brief) → concepts → demo/commands → series “read next”.
- K8s/devops: include namespace/path context in YAML and shell examples.

## Do not

- Commit or push unless the user asks.
- Change `content.config.ts` / `i18n.ts` without explicit request.
- Add `target="_blank"` on external links (site handles it).

## References

- [reference.md](reference.md) — frontmatter templates, categories, commands
- [README.md](../../README.md) — Writing Blog Posts section
- Sample post: `src/content/blog/vi/gioi-thieu-kubernetes.md`
- Sample roadmap: `docs/series/kubernetes-co-ban.md`
- Ideas backlog: `docs/ideas/README.md`, `docs/ideas/kubernetes.md`
