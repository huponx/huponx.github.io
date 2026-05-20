import type { ShikiTransformer } from "shiki";

function parseTitle(rawMeta: string | undefined) {
  if (!rawMeta) return undefined;

  const quoted = rawMeta.match(/\btitle=(["'])(.*?)\1/);
  if (quoted?.[2]) return quoted[2];

  const unquoted = rawMeta.match(/\btitle=([^\s]+)/);
  return unquoted?.[1];
}

export function codeTitleTransformer(): ShikiTransformer {
  return {
    name: "code-title-transformer",
    pre(hast) {
      const title = parseTitle(this.options.meta?.__raw);
      if (!title) return;

      hast.properties ??= {};
      hast.properties["data-title"] = title;
    },
  };
}
