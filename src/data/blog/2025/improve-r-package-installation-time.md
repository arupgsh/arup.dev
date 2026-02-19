---
title: Speed Up R Package Installation
author: Arup Ghosh
pubDatetime: 2025-08-10T00:00:00.000Z
featured: false
draft: false
tags:
  - R
  - Package
  - Parallel
description: "Reduce R package installation time, make Rcpp builds parallel, and other tricks"
---

Setting up R in a new work environment can take a lot of time because package installation and dependency builds are single-threaded by default.

## Install dependencies concurrently

If you are installing multiple source packages, `install.packages()` can run installs in parallel. The `Ncpus` argument controls how many concurrent processes are used, so you can keep builds responsive while still saturating your machine during R package installs. [[1]](#ref-1)

```r
# Use all cores for parallel source installs
install.packages(
  c("data.table", "Rcpp", "sf"),
  Ncpus = parallel::detectCores()
)

# Or set a global default for the session
options(Ncpus = max(1L, parallel::detectCores() - 1L))
```

## Set `MAKEFLAGS` env variable

Many packages compile native code with `make`. Setting `MAKEFLAGS` enables parallel compilation, which is often the slowest part of an R package source install. [[2]](#ref-2)

```r
# Set the number of cores for make-based builds
Sys.setenv(MAKEFLAGS = sprintf("-j%d", parallel::detectCores()))
```

For a permanent setting, add a line like `MAKEFLAGS=-j8` to your `~/.Renviron`.

## Use CCache

If you build packages with C or C++ extensions regularly, `ccache` can skip repeated compilation work by caching object files. This is especially effective in CI or when reinstalling the same R packages after small changes. [[3]](#ref-3)

```sh
# Wrap R package compilation (Linux/macOS) for the current session
export CC="ccache gcc"
export CXX="ccache g++"
export CCACHE_DIR="$HOME/.ccache"
R CMD INSTALL ggplot2
```

```r
# Or use install.packages (still uses CC/CXX if set in the shell)
install.packages("ggplot2")
```

## Other ways to speed things up

- Select a faster CRAN mirror close to your location to reduce download timeouts and latency when fetching R packages. [[4]](#ref-4)

```r
# One-time choice for the current session
chooseCRANmirror()

# Or pin a known fast mirror
options(repos = c(CRAN = "https://cloud.r-project.org"))
```

- On Ubuntu, install prebuilt binaries for R packages when available to avoid compilation overhead. Example for ggplot2: [[5]](#ref-5)

```sh
sudo apt update -qq
sudo apt install --no-install-recommends r-cran-ggplot2
```

- Use Conda/Miniconda with conda-forge packages for a precompiled ecosystem, especially for heavy system dependencies used by R packages. Example for ggplot2: [[6]](#ref-6)

```sh
conda create -n r-fast -c conda-forge r-base r-ggplot2
conda activate r-fast
```

## References

<a id="ref-1"></a>[1] R Core Team. Install packages from repositories or local files. https://stat.ethz.ch/R-manual/R-devel/library/utils/html/install.packages.html

<a id="ref-2"></a>[2] R Core Team. R Installation and Administration. https://cran.r-project.org/doc/manuals/r-release/R-admin.html

<a id="ref-3"></a>[3] Ccache Manual. https://ccache.dev/manual/latest.html

<a id="ref-4"></a>[4] CRAN Mirrors. https://cran.r-project.org/mirrors.html

<a id="ref-5"></a>[5] Ubuntu Packages for R. https://cran.r-project.org/bin/linux/ubuntu/

<a id="ref-6"></a>[6] conda-forge. https://conda-forge.org/
