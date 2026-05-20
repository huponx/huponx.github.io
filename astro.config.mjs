import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { codeTitleTransformer } from "./src/lib/shiki-code-title";

export default defineConfig({
  site: "https://hupham.github.io",
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      transformers: [codeTitleTransformer()],
    },
  },
});
