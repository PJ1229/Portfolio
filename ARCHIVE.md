# site archive log

Tracks sections and surface links **removed from the live lab** (or superseded wholesale), with **archive dates** and **restore snippets**. Full history is always in git (`git log -p -- public/lab/index.html`, etc.).

When you archive something new, append a block under the right heading using the same shape: date, what, file, notes, optional restore HTML.

---

## lab — `public/lab/index.html`

### 2026-05-04 — tmc retreat vlog on home

- **Archived:** 2026-05-04  
- **Removed:** the clause pointing to a retreat vlog plus the embedded player (YouTube `Eb6kjOybPdw` in the last live version). An earlier version used a local `<video>` (`../videos/DSCF3582_720p.mp4`); see commit `5bdb69c` / `73b6785` if you need that variant.  
- **Restore:** append to the **end** of the existing tmc retreat `<p>` (before `</p>`), then add the embed block before the “some other communities” paragraph.

Append immediately **before** the closing `</p>` of that paragraph:

```html
 here's a little vlog from it:
```

Then immediately after that `</p>`:

```html
    <div class="lab-vlog" style="margin-top: 12px; margin-bottom: 18px;">
      <iframe
        class="lab-vlog-video"
        src="https://www.youtube-nocookie.com/embed/Eb6kjOybPdw?rel=0"
        title="Retreat vlog"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
```

### 2026-05-04 — daily activity links on home

- **Archived:** 2026-05-04  
- **Removed:** intro line “here’s some logs of my daily activities:” and the list linking to `dsa.html` (coding) and `guitar.html` (guitar). A short-lived `<details>` “archive” control was removed entirely per preference.  
- **Still in repo:** `public/lab/dsa.html`, `public/lab/guitar.html` (and server routes) unchanged—only the home surface links were dropped.  
- **Restore:** e.g. after the shift/v1 paragraph.

```html
    <p style="margin-bottom: 6px;">
      here’s some logs of my daily activities:
    </p>
    <ul>
      <li><a href="dsa.html">coding</a></li>
      <li><a href="guitar.html">guitar</a></li>
    </ul>
```

---

## film register — `public/film/`

### 2026-08-19 — love from toronto unpublished

- **Unpublished:** 2026-08-19
- **Removed:** the project card from the WORK grid on `public/film/index.html`,
  and the `/love-from-toronto` route from `server.js`. A 404 guard now also
  covers `/film/love-from-toronto.html` so the page isn't live-but-unlinked.
- **Still in repo:** `public/film/love-from-toronto.html` and
  `public/images/love-from-toronto/` are untouched for a future re-publish.
- **Restore:** (1) remove the `/love-from-toronto` 404 guard in `server.js` and
  re-add `app.get("/love-from-toronto", …)` → `sendFilmPage(res,
  "love-from-toronto.html")`; (2) re-add a `.project` card to the grid on
  `public/film/index.html` with its `data-type` / `data-client` / `data-status`
  attributes (see STYLEGUIDE's project content model).

```html
<a class="project" href="/love-from-toronto"
   data-type="FILM"
   data-client="self"
   data-status="IN PROGRESS"
   data-year="2026">
  <img src="../images/love-from-toronto/hero.webp" alt="Love from Toronto" loading="lazy">
  <div class="project-overlay">
    <h2 class="disp">LOVE FROM TORONTO</h2>
    <div data-project-meta></div>
  </div>
</a>
```

---

## superseded site — `public/legacy/`

- **What:** older portfolio tree (v1) kept under `public/legacy/`. The primary site is served from `public/lab/` for `/` and related routes (see `server.js`).  
- **Archived / superseded:** no single cutover date recorded here—treat this folder as historical reference and use git for precise timelines.
