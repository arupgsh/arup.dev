---
title: Fixing ImageMagick "convert" on Cloudflare Pages
author: Arup Ghosh
pubDatetime: 2024-03-03T00:00:00.000Z
featured: false
draft: false
tags:
  - Cloudflare Pages
  - Jekyll
  - ImageMagick
  - DevOps
description: "A practical fix for the ImageMagick convert command missing during Cloudflare Pages Jekyll builds."
---

Recently, I migrated my personal webpage from Firebase hosting to Cloudflare Pages and the `jekyll build` process was failing. A quick inspection of the logs suggested `ImageMagick convert` was not found in the build environment. Cloudflare uses Ubuntu 22.04.2 for the build process and the `asdf` package manager.

To resolve the issue, I set the `UNSTABLE_PRE_BUILD` environment variable as follows:

```bash
asdf plugin add imagemagick && asdf install imagemagick 7.1.1-29 && asdf global imagemagick 7.1.1-29
```

Another issue that led to the build failure was a text-encoding problem in the `jekyll-scholar` extension. The easiest solution is to specify `UTF-8` encoding in the build environment variables.

```bash
LANG=C.UTF-8
LANGUAGE=C.UTF-8
LC_ALL=C.UTF-8
```

Overall, the Cloudflare Pages response time is slightly slower than Firebase, but Cloudflare handles static site generation, and the free plan is more generous with additional features.