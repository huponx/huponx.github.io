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
    siteTitle: "Hu Pham Blog",
    siteDescription: "Notes about software engineering, systems, and things I learn.",
    home: "Home",
    categories: "Categories",
    tags: "Tags",
    latestPosts: "Latest posts",
    allCategories: "All categories",
    postsInCategory: "Posts in category",
    postsTagged: "Posts tagged",
    readMore: "Read post",
    availableIn: "Available in",
    unavailable: "Vietnamese version not available",
    publishedOn: "Published on",
    backToPosts: "Back to posts",
  },
  vi: {
    siteTitle: "Blog Hu Pham",
    siteDescription: "Ghi chú về software engineering, hệ thống, và những điều mình học được.",
    home: "Trang chủ",
    categories: "Chủ đề",
    tags: "Tags",
    latestPosts: "Bài viết mới",
    allCategories: "Tất cả chủ đề",
    postsInCategory: "Bài viết trong chủ đề",
    postsTagged: "Bài viết gắn tag",
    readMore: "Đọc bài viết",
    availableIn: "Có bản",
    unavailable: "English version not available",
    publishedOn: "Ngày đăng",
    backToPosts: "Quay lại danh sách",
  },
} satisfies Record<Lang, Record<string, string>>;

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

export function categoryPath(lang: Lang, category: Category) {
  return `/${lang}/categories/${category}/`;
}

export function tagPath(lang: Lang, tag: string) {
  return `/${lang}/tags/${tag}/`;
}
