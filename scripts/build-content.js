const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const ROOT = process.cwd();
const CSS = "/index.css";
const CONTENT = path.join(ROOT, "content");
const PUBLIC = path.join(ROOT, "public");
const OUT = {
  blog: path.join(PUBLIC, "blog"),
  devlog: path.join(PUBLIC, "devlog"),
};

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }

function layout({ title, body, description="" }) {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${(description||"").replace(/"/g,"&quot;")}"/>
<link rel="stylesheet" href="${CSS}"/>
</head><body><div class="intro-container">
${body}
</div></body></html>`;
}

/* ---------- BLOG ---------- */
function buildBlog() {
  const src = path.join(CONTENT, "blog");
  const out = OUT.blog, outPosts = path.join(out, "posts");
  ensureDir(out); ensureDir(outPosts);

  const files = fs.existsSync(src) ? fs.readdirSync(src).filter(f => /\.mdx?$/.test(f)) : [];
  const posts = files.map(f => {
    const raw = fs.readFileSync(path.join(src, f), "utf8");
    const { data, content } = matter(raw);
    if (data.published === false) return null;

    const slug = slugify(f.replace(/\.(md|mdx)$/,""));
    const html = marked.parse(content);
    const title = data.title || slug;
    const date = data.date || "";
    const tags = (data.tags||[]).join(", ");
    const desc = data.summary || "";

    const body = `
<h1>${title}</h1>
<p class="description"><em>${[date, tags].filter(Boolean).join(" · ")}</em></p>
<hr class="separator"/>
<article class="description">${html}</article>
<p><a href="/blog/">← All posts</a></p>`;
    fs.writeFileSync(path.join(outPosts, `${slug}.html`), layout({ title: `${title} — PJ`, body, description: desc }));
    return { slug, title, date, desc };
  }).filter(Boolean).sort((a,b)=> (a.date<b.date?1:-1));

  const list = posts.map(p => `<li><a href="/blog/posts/${p.slug}.html">${p.title}</a>${p.date?` <span> · ${p.date}</span>`:""}</li>`).join("\n");
  const body = `
<h1>Blog</h1>
<ul class="bullets">
${list || "<li>No posts yet.</li>"}
</ul>
<p><a href="/">← Back to home</a></p>`;
  fs.writeFileSync(path.join(out, "index.html"), layout({ title: "PJ’s Blog", body, description: "Posts by PJ" }));
}

/* ---------- DEVLOG (per project) ---------- */
function readMarkdown(filePath){
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { data, html: marked.parse(content) };
}

function buildDevlog() {
  const src = path.join(CONTENT, "devlog");
  const out = OUT.devlog;
  ensureDir(out);
  if (!fs.existsSync(src)) { fs.writeFileSync(path.join(out,"index.html"), layout({title:"Devlog — PJ", body:"<h1>Devlog</h1><p>No projects yet.</p>"})); return; }

  const projects = fs.readdirSync(src).filter(d => fs.statSync(path.join(src,d)).isDirectory());

  const projectCards = [];

  for (const dir of projects) {
    const projSlug = slugify(dir);
    const projSrc = path.join(src, dir);
    const projOut = path.join(out, projSlug);
    const entriesSrc = path.join(projSrc, "entries");
    ensureDir(projOut);

    // project overview
    const overviewPath = path.join(projSrc, "project.md");
    const { data: pData, html: pHtml } = readMarkdown(overviewPath);

    // entries
    const entryFiles = fs.existsSync(entriesSrc) ? fs.readdirSync(entriesSrc).filter(f => /\.mdx?$/.test(f)) : [];
    const entries = entryFiles.map(f => {
      const { data, html } = readMarkdown(path.join(entriesSrc, f));
      const eSlug = slugify(f.replace(/\.(md|mdx)$/,""));
      const eTitle = data.title || eSlug;
      const eDate = data.date || "";
      const eDesc = data.summary || "";
      const body = `
<h1>${eTitle}</h1>
<p class="description"><em>${eDate}</em></p>
<hr class="separator"/>
<article class="description">${html}</article>
<p><a href="/devlog/${projSlug}/">← Back to ${pData.title || dir}</a></p>`;
      fs.writeFileSync(path.join(projOut, `${eSlug}.html`), layout({ title: `${eTitle} — ${pData.title||dir} — PJ`, body, description: eDesc }));
      return { slug: eSlug, title: eTitle, date: eDate };
    }).sort((a,b)=> (a.date<b.date?1:-1));

    // project index
    const list = entries.map(e => `<li><a href="/devlog/${projSlug}/${e.slug}.html">${e.title}</a>${e.date?` <span> · ${e.date}</span>`:""}</li>`).join("\n");
    const links = pData.links ? Object.entries(pData.links).map(([k,v])=>`<a target="_blank" rel="noopener noreferrer" href="${v}">${k}</a>`).join(" · ") : "";
    const projBody = `
<h1>${pData.title || dir}</h1>
<p class="description">${pData.summary || ""} ${links?`<br/><small>${links}</small>`:""}</p>
<hr class="separator"/>
<article class="description">${pHtml}</article>
<h2>Entries</h2>
<ul class="bullets">
${list || "<li>No entries yet.</li>"}
</ul>
<p><a href="/devlog/">← Devlog home</a></p>`;
    fs.writeFileSync(path.join(projOut, "index.html"), layout({ title: `${pData.title || dir} — Devlog — PJ`, body: projBody, description: pData.summary || "" }));

    projectCards.push({
      slug: projSlug,
      title: pData.title || dir,
      summary: pData.summary || "",
      latest: entries[0]?.date || ""
    });
  }

  // devlog home
  projectCards.sort((a,b)=> (a.latest<b.latest?1:-1));
  const cards = projectCards.map(p =>
    `<li><a href="/devlog/${p.slug}/">${p.title}</a>${p.latest?` <span> · updated ${p.latest}</span>`:""}<br/><span class="description">${p.summary}</span></li>`
  ).join("\n");
  const body = `
<h1>Devlog</h1>
<ul class="bullets">
${cards || "<li>No projects yet.</li>"}
</ul>
<p><a href="/">← Back to home</a></p>`;
  fs.writeFileSync(path.join(out, "index.html"), layout({ title: "Devlog — PJ", body, description: "Project logs and notes" }));
}

function buildAll(){
  buildBlog();
  buildDevlog();
  console.log("Built blog + devlog.");
}
buildAll();
