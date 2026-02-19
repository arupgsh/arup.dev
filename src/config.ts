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
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Europe/Oslo", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
