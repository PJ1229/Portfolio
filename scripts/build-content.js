// scripts/build-content.js
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

/* -------------------- Paths & Helpers -------------------- */
const ROOT = process.cwd();
const CSS_PATH = "/index.css";
const CONTENT = path.join(ROOT, "content");
const PUBLIC = path.join(ROOT, "public");
const OUT = {
  blog: path.join(PUBLIC, "blog"),
  devlog: path.join(PUBLIC, "devlog"),
};

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function escapeAttr(s = "") {
  return String(s).replace(/"/g, "&quot;");
}

// Date helpers
function daySuffix(d) {
  if (d >= 11 && d <= 13) return "th";
  const last = d % 10;
  if (last === 1) return "st";
  if (last === 2) return "nd";
  if (last === 3) return "rd";
  return "th";
}
function fmtHomeDate(iso) {
  const dt = new Date(iso);
  if (isNaN(dt)) return iso || "";
  return (
    dt.toLocaleString("en-US", { month: "short" }) +
    ". " +
    dt.getDate() +
    daySuffix(dt.getDate()) +
    ", " +
    dt.getFullYear()
  );
}

/* -------------------- Marked Setup -------------------- */
marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false,
});

/* -------------------- HTML Layout -------------------- */
function layout({ title, description = "", body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeAttr(title)}</title>
<meta name="description" content="${escapeAttr(description)}"/>
<link rel="stylesheet" href="${CSS_PATH}"/>
</head>
<body>
  <div class="intro-container">
    ${body}
  </div>
</body>
</html>`;
}

/* -------------------- Markdown Reader -------------------- */
function readMarkdown(filePath) {
  if (!fs.existsSync(filePath)) return { data: {}, html: "" };
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(content || "");
  return { data: data || {}, html };
}

/* =========================================================
   BLOG
========================================================= */
function buildBlog() {
  const src = path.join(CONTENT, "blog");
  const out = OUT.blog;
  const outPosts = path.join(out, "posts");
  ensureDir(out);
  ensureDir(outPosts);

  const files = fs.existsSync(src)
    ? fs.readdirSync(src).filter((f) => /\.mdx?$/i.test(f))
    : [];

  const posts = files
    .map((f) => {
      const { data, html } = readMarkdown(path.join(src, f));
      if (data.published === false) return null;
      const slug = slugify(f.replace(/\.(md|mdx)$/i, ""));
      const title = data.title || slug;
      const date = data.date || "";
      const tags = Array.isArray(data.tags) ? data.tags.join(", ") : "";
      const desc = data.summary || "";

      const body = `
<h1>${title}</h1>
<p class="description"><em>${[date, tags].filter(Boolean).join(" · ")}</em></p>
<hr class="separator"/>
<article class="prose">
${html}
</article>
<p><a href="/blog/">← All posts</a></p>`;

      fs.writeFileSync(
        path.join(outPosts, `${slug}.html`),
        layout({ title: `${title} — PJ`, description: desc, body })
      );

      return { slug, title, date, desc };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const list = posts
    .map(
      (p) =>
        `<li><a href="/blog/posts/${p.slug}.html">${p.title}</a>${
          p.date ? ` <span> · ${p.date}</span>` : ""
        }</li>`
    )
    .join("\n");

  const body = `
<h1>Blog</h1>
<ul class="bullets">
${list || "<li>No posts yet.</li>"}
</ul>
<p><a href="/">← Back to home</a></p>`;

  fs.writeFileSync(
    path.join(out, "index.html"),
    layout({ title: "PJ’s Blog", description: "Posts by PJ", body })
  );
}

/* =========================================================
   DEVLOG (Projects + Entries)
   - Project page from project.md
   - Entries from entries/*.md
   - Devlog home lists projects
========================================================= */
function buildDevlog() {
  const src = path.join(CONTENT, "devlog");
  const out = OUT.devlog;
  ensureDir(out);

  if (!fs.existsSync(src)) {
    fs.writeFileSync(
      path.join(out, "index.html"),
      layout({
        title: "Devlog — PJ",
        description: "Project logs and notes",
        body: `<h1>Devlog</h1><p>No projects yet.</p><p><a href="/">← Back to home</a></p>`,
      })
    );
    return [];
  }

  const projects = fs
    .readdirSync(src)
    .filter((d) => fs.statSync(path.join(src, d)).isDirectory());

  const projectCards = [];

  for (const dir of projects) {
    const projSrc = path.join(src, dir);
    const projOut = path.join(out, slugify(dir));
    const projSlug = slugify(dir);
    ensureDir(projOut);

    // Overview
    const overviewPath = path.join(projSrc, "project.md");
    const { data: pData, html: pHtml } = readMarkdown(overviewPath);
    const projTitle = pData.title || dir;
    const projSummary = pData.summary || "";
    const projLinks = pData.links || null;

    // Entries
    const entriesDir = path.join(projSrc, "entries");
    const entryFiles = fs.existsSync(entriesDir)
      ? fs.readdirSync(entriesDir).filter((f) => /\.mdx?$/i.test(f))
      : [];

    const entries = entryFiles
      .map((f) => {
        const { data, html } = readMarkdown(path.join(entriesDir, f));
        const eSlug = slugify(f.replace(/\.(md|mdx)$/i, ""));
        const eTitle = data.title || eSlug;
        const eDate = data.date || "";
        const eDesc = data.summary || "";

        const body = `
<h1>${eTitle}</h1>
<p class="description"><em>${eDate}</em></p>
<hr class="separator"/>
<article class="prose">
${html}
</article>
<p><a href="/devlog/${projSlug}/">← Back to ${projTitle}</a></p>`;

        fs.writeFileSync(
          path.join(projOut, `${eSlug}.html`),
          layout({
            title: `${eTitle} — ${projTitle} — PJ`,
            description: eDesc,
            body,
          })
        );

        return { slug: eSlug, title: eTitle, date: eDate };
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    // Project page
    const linksHtml = projLinks
      ? Object.entries(projLinks)
          .map(
            ([k, v]) =>
              `<a target="_blank" rel="noopener noreferrer" href="${v}">${k}</a>`
          )
          .join(" · ")
      : "";

    const entriesList = entries
      .map(
        (e) =>
          `<li><a href="/devlog/${projSlug}/${e.slug}.html">${e.title}</a>${
            e.date ? ` <span> · ${e.date}</span>` : ""
          }</li>`
      )
      .join("\n");

    const projBody = `
<h1>${projTitle}</h1>
<p class="description">${projSummary}${
      linksHtml ? `<br/><small>${linksHtml}</small>` : ""
    }</p>
<hr class="separator"/>
<article class="prose">
${pHtml}
</article>
<h2>Entries</h2>
<ul class="bullets">
${entriesList || "<li>No entries yet.</li>"}
</ul>
<p><a href="/devlog/">← Devlog home</a></p>`;

    fs.writeFileSync(
      path.join(projOut, "index.html"),
      layout({
        title: `${projTitle} — Devlog — PJ`,
        description: projSummary,
        body: projBody,
      })
    );

    projectCards.push({
      slug: projSlug,
      title: projTitle,
      summary: projSummary,
      latest: entries[0]?.date || "",
      homepage: !!pData.homepage,
      homepageDate: pData.date || "",
      homepageUrl: pData.url || null,
    });
  }

  // Devlog home (projects list)
  projectCards.sort((a, b) => (a.latest < b.latest ? 1 : -1));

  const cards = projectCards
    .map(
      (p) =>
        `<li><a href="/devlog/${p.slug}/">${p.title}</a>${
          p.latest ? ` <span> · updated ${p.latest}</span>` : ""
        }<br/><span class="description">${p.summary}</span></li>`
    )
    .join("\n");

  const body = `
<h1>Devlog</h1>
<ul class="bullets">
${cards || "<li>No projects yet.</li>"}
</ul>
<p><a href="/">← Back to home</a></p>`;

  fs.writeFileSync(
    path.join(OUT.devlog, "index.html"),
    layout({
      title: "Devlog — PJ",
      description: "Project logs and notes",
      body,
    })
  );

  return projectCards; // used by homepage injection
}

/* =========================================================
   HOMEPAGE PROJECT TIMELINE INJECTION
   Pulls each project's project.md if `homepage: true`
========================================================= */
function injectHomepageProjects(projectCards, maxItems = 8) {
  const homePath = path.join(PUBLIC, "index.html");
  if (!fs.existsSync(homePath)) {
    console.warn("public/index.html not found; skipping homepage injection.");
    return;
  }

  const startTag = "<!-- DEVLOG_AUTO_START -->";
  const endTag = "<!-- DEVLOG_AUTO_END -->";

  let html = fs.readFileSync(homePath, "utf8");
  const start = html.indexOf(startTag);
  const end = html.indexOf(endTag);

  if (start === -1 || end === -1 || end <= start) {
    console.warn("Devlog markers not found in index.html; skipping injection.");
    return;
  }

  const items = (projectCards || [])
    .filter((p) => p.homepage && p.homepageDate)
    .sort((a, b) => (a.homepageDate < b.homepageDate ? 1 : -1))
    .slice(0, maxItems);

  const lines = items
    .map((p) => {
      const url = p.homepageUrl || `/devlog/${p.slug}/`;
      return `${fmtHomeDate(p.homepageDate)} - <a target="_blank" rel="noopener noreferrer" href="${url}">${p.title}</a><br>`;
    })
    .join("\n");

  const before = html.slice(0, start + startTag.length);
  const after = html.slice(end);
  const injected = `${before}\n${lines ? "    " + lines : ""}\n${after}`;
  fs.writeFileSync(homePath, injected);

  console.log(`Injected ${items.length} homepage project item(s).`);
}

/* =========================================================
   BUILD ALL
========================================================= */
function buildAll() {
  buildBlog();
  const cards = buildDevlog();
  injectHomepageProjects(cards, 8);
  console.log("Built blog + devlog + homepage project timeline.");
}

buildAll();
