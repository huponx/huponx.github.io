import type { CollectionEntry } from "astro:content";

export const languages = ["en", "vi"] as const;
export type Lang = (typeof languages)[number];

export const defaultLang: Lang = "en";

export const languageNames: Record<Lang, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

export const ui = {
  en: {
    siteTitle: "Hung Blog",
    siteDescription: "Notes about software engineering, systems, and things I learn.",
    home: "Home",
    categories: "Categories",
    series: "Series",
    tags: "Tags",
    latestPosts: "Latest posts",
    allCategories: "All categories",
    postsInCategory: "Posts in category",
    postsTagged: "Posts tagged",
    readMore: "Read post",
    availableIn: "Also available in",
    unavailable: "Vietnamese version not available",
    publishedOn: "Published on",
    backToPosts: "Back to posts",
    searchPlaceholder: "Search posts…",
    searchLabel: "Search blog posts",
    searchNoResults: "No posts found.",
    sidebarTitle: "Categories",
    sidebarToggle: "Browse",
    viewAll: "View all",
    allSeries: "All series",
    postsInSeries: "Posts in this series",
    part: "Part",
    previousPage: "Previous",
    nextPage: "Next",
    pageOf: "Page",
    of: "of",
    switchTheme: "Switch theme",
    themeAuto: "Theme: Auto",
    themeLight: "Theme: Light",
    themeDark: "Theme: Dark",
    goToTop: "Go to top",
    tableOfContents: "Table of contents",
    previousPost: "Previous",
    nextPost: "Next",
    copyCode: "Copy",
    copiedCode: "Copied",
    copyCodeFailed: "Copy failed",
  },
  vi: {
    siteTitle: "Hung Blog",
    siteDescription: "Ghi chú về software engineering, hệ thống, và những điều mình học được.",
    home: "Trang chủ",
    categories: "Chủ đề",
    series: "Chuỗi bài",
    tags: "Tags",
    latestPosts: "Bài viết mới",
    allCategories: "Tất cả chủ đề",
    postsInCategory: "Bài viết trong chủ đề",
    postsTagged: "Bài viết gắn tag",
    readMore: "Đọc bài viết",
    availableIn: "Cũng có bản",
    unavailable: "English version not available",
    publishedOn: "Ngày đăng",
    backToPosts: "Quay lại danh sách",
    searchPlaceholder: "Tìm bài viết…",
    searchLabel: "Tìm kiếm bài viết",
    searchNoResults: "Không tìm thấy bài viết.",
    sidebarTitle: "Chủ đề",
    sidebarToggle: "Duyệt",
    viewAll: "Xem tất cả",
    allSeries: "Tất cả chuỗi bài",
    postsInSeries: "Bài trong chuỗi này",
    part: "Phần",
    previousPage: "Trước",
    nextPage: "Sau",
    pageOf: "Trang",
    of: "trên",
    switchTheme: "Đổi giao diện",
    themeAuto: "Giao diện: Tự động",
    themeLight: "Giao diện: Sáng",
    themeDark: "Giao diện: Tối",
    goToTop: "Lên đầu trang",
    tableOfContents: "Mục lục",
    previousPost: "Bài trước",
    nextPost: "Bài sau",
    copyCode: "Copy",
    copiedCode: "Đã copy",
    copyCodeFailed: "Copy lỗi",
  },
} satisfies Record<Lang, Record<string, string>>;

export const POSTS_PER_PAGE = 6;

export function pageCount<T>(items: T[], perPage: number = POSTS_PER_PAGE): number {
  return Math.max(1, Math.ceil(items.length / perPage));
}

export function paginate<T>(
  items: T[],
  currentPage: number,
  perPage: number = POSTS_PER_PAGE,
): T[] {
  const start = (currentPage - 1) * perPage;
  return items.slice(start, start + perPage);
}

export function pagePath(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  return `${basePath}page/${page}/`;
}

export function formatPostCount(lang: Lang, count: number) {
  if (lang === "vi") {
    return count === 1 ? "1 bài" : `${count} bài`;
  }
  return count === 1 ? "1 post" : `${count} posts`;
}

export const categoryLabels = {
  en: {
    "web-development": "Web Development",
    programming: "Programming",
    devops: "DevOps",
    database: "Database",
    "system-design": "System Design",
    notes: "Notes",
  },
  vi: {
    "web-development": "Web Development",
    programming: "Lập trình",
    devops: "DevOps",
    database: "Cơ sở dữ liệu",
    "system-design": "Thiết kế hệ thống",
    notes: "Ghi chú",
  },
} satisfies Record<Lang, Record<string, string>>;

export type BlogPost = CollectionEntry<"blog">;
export type Category = keyof (typeof categoryLabels)["en"];
export interface SeriesSummary {
  id: string;
  title: string;
  posts: BlogPost[];
  latestDate: Date;
}

export function isLang(value: string | undefined): value is Lang {
  return languages.includes(value as Lang);
}

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export function visiblePosts(posts: BlogPost[]) {
  return posts.filter((post) => !post.data.draft);
}

export function postsByLang(posts: BlogPost[], lang: Lang) {
  return visiblePosts(posts).filter((post) => post.data.lang === lang);
}

export function postsByCategory(posts: BlogPost[], lang: Lang, category: Category) {
  return postsByLang(posts, lang).filter((post) => post.data.category === category);
}

export function postsByTag(posts: BlogPost[], lang: Lang, tag: string) {
  return postsByLang(posts, lang).filter((post) => post.data.tags.includes(tag));
}

export function sortSeriesPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const orderDiff = (a.data.series?.order ?? 0) - (b.data.series?.order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return a.data.pubDate.getTime() - b.data.pubDate.getTime();
  });
}

export function postsBySeries(posts: BlogPost[], lang: Lang, seriesId: string) {
  return sortSeriesPosts(
    postsByLang(posts, lang).filter((post) => post.data.series?.id === seriesId),
  );
}

export function uniqueSeries(posts: BlogPost[], lang: Lang): SeriesSummary[] {
  const groups = new Map<string, BlogPost[]>();

  for (const post of postsByLang(posts, lang)) {
    if (!post.data.series) continue;
    const current = groups.get(post.data.series.id) ?? [];
    current.push(post);
    groups.set(post.data.series.id, current);
  }

  return Array.from(groups.entries())
    .map(([id, seriesPosts]) => {
      const sortedPosts = sortSeriesPosts(seriesPosts);
      const latestDate = sortedPosts.reduce(
        (latest, post) => (post.data.pubDate > latest ? post.data.pubDate : latest),
        sortedPosts[0]?.data.pubDate ?? new Date(0),
      );
      return {
        id,
        title: sortedPosts[0]?.data.series?.title ?? id,
        posts: sortedPosts,
        latestDate,
      };
    })
    .sort((a, b) => b.latestDate.getTime() - a.latestDate.getTime());
}

export function uniqueCategories(posts: BlogPost[], lang: Lang) {
  return Array.from(
    new Set(postsByLang(posts, lang).map((post) => post.data.category as Category)),
  ).sort();
}

export function uniqueTags(posts: BlogPost[], lang: Lang) {
  return Array.from(new Set(postsByLang(posts, lang).flatMap((post) => post.data.tags))).sort();
}

export function findTranslation(post: BlogPost, posts: BlogPost[]) {
  return visiblePosts(posts).find(
    (candidate) =>
      candidate.data.translationKey === post.data.translationKey &&
      candidate.data.lang !== post.data.lang,
  );
}

export function blogPath(post: BlogPost) {
  return `/${post.data.lang}/blog/${post.data.slug}/`;
}

export function adjacentPosts(post: BlogPost, posts: BlogPost[]) {
  const lang = post.data.lang;

  if (post.data.series) {
    const seriesPosts = postsBySeries(posts, lang, post.data.series.id);
    const index = seriesPosts.findIndex((candidate) => candidate.id === post.id);
    return {
      previous: index > 0 ? seriesPosts[index - 1] : undefined,
      next:
        index >= 0 && index < seriesPosts.length - 1 ? seriesPosts[index + 1] : undefined,
    };
  }

  const langPosts = sortPosts(postsByLang(posts, lang));
  const index = langPosts.findIndex((candidate) => candidate.id === post.id);
  return {
    previous:
      index >= 0 && index < langPosts.length - 1 ? langPosts[index + 1] : undefined,
    next: index > 0 ? langPosts[index - 1] : undefined,
  };
}

export function categoryPath(lang: Lang, category: Category) {
  return `/${lang}/categories/${category}/`;
}

export function tagPath(lang: Lang, tag: string) {
  return `/${lang}/tags/${tag}/`;
}

export function seriesPath(lang: Lang, seriesId: string) {
  return `/${lang}/series/${seriesId}/`;
}
