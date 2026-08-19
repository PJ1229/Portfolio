## style guide (portfolio)

## film register (`public/film/`)

The film portfolio is a separate register from the lab site: its own stylesheet
(`public/film/film.css`) and page class (`.film-page`). The lowercase hard rule
below does **not** apply to it. The `/inspo` page has moved onto this register.
It is a **Projects** portfolio now — film work and client work share the same
grid; client work is tagged, not split into its own section.

### primary nav
- **format**: `WORK · WRITING · INFO` — current page/section renders as a
  `<span>`, the others are links. `WORK` → `/`, `WRITING` → `/writing`
  (302 → Substack), `INFO` → `/about`.
- **footer**: every page carries an `INSPO` link in the footer (`/inspo`).

### project content model
- Each project element carries its model as data attributes, rendered by
  `public/film/projects.js` into its `[data-project-meta]` child:
  - `data-type="EVENT,PROMO,FILM"` — comma-separated type[] (FILM, EVENT,
    PROMO, SPORTS, BRAND), rendered as mono tag chips.
  - `data-client="self"` — `"self"` renders nothing; any other value (e.g.
    `"Michigan Athletics"`) renders an inverted client badge.
  - `data-status="IN PROGRESS"` + optional `data-year="2026"` — status line.
- To add client work, add a `.project` card with `data-client="<client name>"`.

### project detail template
- Detail pages are an ordered list (`<ol class="project-sections">`) of
  independently-optional sections, in this order:
  `01 Overview (always) → 02 Trailer/Hero → 03 BTS → 04 Impact/Results →
  05 Credits → 06 Gallery → 07 Related Writing`.
- Render a section only when it has content — delete its `<li>` to omit it;
  insert a new `<li>` in order to add one. No placeholder sections.

### type — three roles, no more
- **display titles** — condensed grotesque, uppercase, tight tracking (`Anton`).
- **running header / prose** — serif, Title Case / sentence case (`Instrument Serif`).
- **metadata / nav / credits** — mono, uppercase, letterspaced (`IBM Plex Mono`).

### tokens
- black canvas `#000000` · white paper `#FFFFFF` · ink `#000` · grays for dim/meta
  (dim values are the paper-dim/ink-dim vars in `film.css`).
- black and white only — no color accent. labels, nav, and metadata use grayscale.
- hairline frames only. no shadows, no rounded corners, no gradients.

### rules
- never mix casings within a role. display = uppercase, metadata = uppercase
  mono, prose = Title Case / sentence case.
- titles sit optically flush to the card's edges.

### voice + casing
- **default casing**: sentence case for paragraphs, **lowercase** for lab headings/titles unless there’s a strong reason not to.
- **hard rule (lab pages)**: all lab page text is forced lowercase via CSS (`text-transform: lowercase`).
- **contractions**: use them (match the casual tone).
- **punctuation**: keep it clean; avoid extra exclamation points.

### lab nav microcopy
- **format**: `back · yt channel · my inspo` (keep this strip to those three items; link other hub pages from body copy instead).
- **links**: external links use `target="_blank"` + `rel="noopener noreferrer"`.

### lab writing page
- **page title (`h1`)**: lowercase (e.g. `writing`).
- **post titles**: lowercase on the list page and on the post page (`<title>` + `h1`).
- **reading time**: `feb 2026 · X min read` (use `min`, not `mins`).

### inspo page
- **red marker**: wrap inline emphasis as `<span class="is-red">red</span>`.
- **red items**: add `class="is-red"` on the `<a>` element.
- **weight**: keep font weight consistent; red should only change color.
- **red color**: `#ff2d2d`, scoped to `.film-page.inspo-page` — this is the one
  deliberate color exception to the otherwise monochrome film register.

### images
- **responsive crop rule** (lab home photo): use `object-fit: cover` and pick the anchor with `object-position` depending on which side should crop first.

