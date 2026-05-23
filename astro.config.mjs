import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";
import { rehypeExternalLinks } from "./src/lib/rehype-external-links";
import { codeTitleTransformer } from "./src/lib/shiki-code-title";

export default defineConfig({
  site: "https://hungp29.github.io",
  redirects: {
    "/vi/blog/gioi-thieu-kubernetes": "/vi/blog/intro-kubernetes",
    "/vi/blog/gioi-thieu-kubernetes/": "/vi/blog/intro-kubernetes/",
    "/vi/blog/kien-truc-cluster-kubernetes": "/vi/blog/cluster-architecture-kubernetes",
    "/vi/blog/kien-truc-cluster-kubernetes/": "/vi/blog/cluster-architecture-kubernetes/",
  },
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid"],
    },
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      transformers: [codeTitleTransformer()],
    },
    rehypePlugins: [
      rehypeExternalLinks,
      [rehypeMermaid, { strategy: "img-svg", dark: true }],
    ],
  },
});
