import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://hungp29.github.io",
  integrations: [sitemap()],
});
