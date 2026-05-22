import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

const SITE_HOST = new URL("https://hupham.github.io").hostname;

function isExternalHref(href: string): boolean {
  if (
    href.startsWith("#") ||
    href.startsWith("/") ||
    href.startsWith("./") ||
    href.startsWith("../")
  ) {
    return false;
  }

  if (!/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    return false;
  }

  try {
    return new URL(href).hostname !== SITE_HOST;
  } catch {
    return false;
  }
}

/** Open markdown links to third-party sites in a new tab. */
export function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;

      const href = node.properties?.href;
      if (typeof href !== "string" || !isExternalHref(href)) return;

      node.properties = {
        ...node.properties,
        target: "_blank",
        rel: "noopener noreferrer",
      };
    });
  };
}
