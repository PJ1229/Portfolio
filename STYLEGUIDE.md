## style guide (portfolio)

## film register (`public/film/`)

The film portfolio is a separate register from the lab site: its own stylesheet
(`public/film/film.css`) and page class (`.film-page`). The lowercase hard rule
below does **not** apply to it. The `/inspo` page has moved onto this register.

### type — three roles, no more
- **display titles** — condensed grotesque, uppercase, tight tracking (`Anton`).
- **running header / prose** — serif, Title Case / sentence case (`Instrument Serif`).
- **metadata / nav / credits** — mono, uppercase, letterspaced (`IBM Plex Mono`).

### tokens
- black canvas `#0F0F0F` · white paper `#FFFFFF` · ink `#000` · grays for dim/meta.
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

### images
- **responsive crop rule** (lab home photo): use `object-fit: cover` and pick the anchor with `object-position` depending on which side should crop first.

