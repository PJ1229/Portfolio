## Codebase layout

- **New “lab” site (primary):**
  - Lives under `public/lab/` (e.g. `public/lab/index.html`, `public/lab/dsa.html`, `public/lab/guitar.html`, `public/lab/blog.html`, `public/lab/inspo.html`, plus blog post files under `public/lab/blog/`).
  - Shared styles live in `public/index.css`.
  - Server routes `/`, `/lab`, and `/lab/` all serve `public/lab/index.html` (no redirects).

- **Legacy v1 site:**
  - Lives under `public/legacy/` (mirrors the old structure: `index.html`, `film.html`, `experience.html`, `projects.html`, `blog.html`, `dsa.html`, `guitar.html`, plus `film-projects/`, `experience/`, `blog-posts/`, `js/`).
  - Served at `/legacy/` (with `/legacy` → `/legacy/` redirect).

- **Shared assets:**
  - Fonts, images, icons, PDFs, etc. stay in their existing folders under `public/` and are used by both the lab and legacy pages.

The goal is: **anything “lab” you actively maintain lives under `public/lab/`; anything at the root of `public/` is considered legacy.**
Legacy is now explicitly under `public/legacy/`.

## Redirects (important)

If you have redirects configured outside the app (Cloudflare/DNS/Heroku), avoid creating a loop between `/` and `/lab`. The app intentionally does not redirect for lab routes to prevent `ERR_TOO_MANY_REDIRECTS`.

