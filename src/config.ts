export const SITE = {
  website: "https://arup.dev",
  author: "Arup Ghosh",
  profile: "https://arup.dev/about",
  desc: "Personal website of Arup Ghosh, a computational biologist and bioinformatician. I am interested in single-cell genomics, spatial transcriptomics, and computational methods for analyzing high-dimensional biological data.",
  title: "Arup Ghosh",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/arupgsh/arup.dev/edit/main/",
  },
  giscus: {
    enabled: true,
    repo: "arupgsh/arup.dev",
    repoId: "R_kgDORUS3uA",
    category: "General",
    categoryId: "DIC_kwDORUS3uM4C20Sd",
    mapping: "pathname",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "top",
    lang: "en",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Europe/Oslo", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;

// giscus original
// <script src="https://giscus.app/client.js"
//         data-repo="arupgsh/arup.dev"
//         data-repo-id="R_kgDORUS3uA"
//         data-category="General"
//         data-category-id="DIC_kwDORUS3uM4C20Sd"
//         data-mapping="og:title"
//         data-strict="1"
//         data-reactions-enabled="1"
//         data-emit-metadata="0"
//         data-input-position="top"
//         data-theme="preferred_color_scheme"
//         data-lang="en"
//         data-loading="lazy"
//         crossorigin="anonymous"
//         async>
// </script>
