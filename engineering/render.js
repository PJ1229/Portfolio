const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const content = require("./content");

// Publication requires a code review of the exact restricted payload as well as
// cleared:true. Editing content (including slug or cleared) cannot grant access.
const approvedDigests = new Set([
  // um-autolog: generic technical capabilities verified against supplied source.
  // No footage, internal vocabulary, performance claims, or private repo URL.
  "0c351aaf199efdf4218d2c0a649aefc4a833de350d85728e9ad0d5354ce1acaa",
]);
function publicationDigest(project) {
  return createHash("sha256").update(JSON.stringify({
    slug: project.slug, client: project.client, specs: project.specs,
    repo: project.repo, media: project.media,
  })).digest("hex");
}
function isCleared(project) {
  return project.cleared === true && approvedDigests.has(publicationDigest(project));
}
function escape(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function publicText(value, project) {
  let result = String(value ?? "");
  if (!isCleared(project) && project.client) {
    const client = String(project.client).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(client, "gi"), "[client withheld]");
  }
  return escape(result);
}
function media(item) {
  // Only local raster assets are accepted here. Missing files retain their box.
  const valid = /^\/assets\/engineering\/[a-zA-Z0-9/_-]+\.(webp|png|jpe?g|avif)$/.test(item.src || "");
  const exists = valid && fs.existsSync(path.join(__dirname, "../public", item.src));
  return `<figure class="engineering-media">${exists
    ? `<img src="${escape(item.src)}" alt="${escape(item.alt)}" loading="lazy" width="1600" height="900">`
    : `<div class="engineering-empty">${escape(item.alt || "Project media pending")}</div>`
  }${item.caption ? `<figcaption>${escape(item.caption)}</figcaption>` : ""}</figure>`;
}
function drawing(item) {
  // Accept only a small, inert technical-drawing SVG vocabulary. Rebuild tags
  // instead of injecting source XML; discard fills, styles, links and scripts.
  const sourcePath = item.src === "/assets/engineering/chassis.svg"
    ? path.join(__dirname, "../public/assets/engineering/chassis.svg") : null;
  if (!sourcePath || !fs.existsSync(sourcePath)) return media(item);
  const source = fs.readFileSync(sourcePath, "utf8");
  const tags = new Set(["svg", "g", "path", "line", "polyline", "polygon", "circle", "ellipse", "rect"]);
  const attributes = new Set(["viewBox", "d", "points", "x", "y", "x1", "x2", "y1", "y2", "cx", "cy", "r", "rx", "ry", "width", "height", "transform", "stroke-width", "stroke-linecap", "stroke-linejoin"]);
  const parts = [];
  for (const tag of source.matchAll(/<(\/)?([a-zA-Z]+)\b([^>]*?)(\/?)>/g)) {
    const [, closing, name, raw, selfClosing] = tag;
    if (!tags.has(name)) continue;
    if (closing) { parts.push(`</${name}>`); continue; }
    const attrs = [];
    for (const match of raw.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/g)) {
      if (attributes.has(match[1])) attrs.push(`${match[1]}="${escape(match[3])}"`);
    }
    if (name === "svg") attrs.push('xmlns="http://www.w3.org/2000/svg" role="img"', `aria-label="${escape(item.alt)}"`);
    parts.push(`<${name} ${attrs.join(" ")} fill="none" stroke="currentColor"${selfClosing ? "/" : ""}>`);
  }
  if (!parts.some(part => part.startsWith("<svg "))) return media({ ...item, src: "" });
  return `<figure class="engineering-media engineering-drawing">${parts.join("")}<figcaption>${escape(item.caption)}</figcaption></figure>`;
}
function renderProject(project, index) {
  const cleared = isCleared(project);
  const text = value => publicText(value, project);
  const specs = cleared && project.specs.length
    ? `<table class="engineering-specs"><caption class="engineering-sr">${text(project.name)} specifications</caption><tbody>${project.specs.map(spec => `<tr><th scope="row">${text(spec.label)}</th><td>${text(spec.value)}</td></tr>`).join("")}</tbody></table>`
    : `<p class="engineering-redacted">${text(project.redactedNote || "Specifications pending publication clearance.")}</p>`;
  const repo = cleared && /^https:\/\//.test(project.repo || "")
    ? `<a class="engineering-repo" href="${escape(project.repo)}">View repository <span aria-hidden="true">↗</span></a>` : "";
  // Unapproved media/URLs never enter the response. Blank media is an empty state.
  const images = (cleared ? project.media : project.media.filter(item => !item.src && project.cleared === true))
    .map(item => {
      // text() escapes HTML; media() also escapes, so use safe neutral labels
      // for unapproved media instead of exposing arbitrary asset metadata.
      return media(cleared ? item : { src: "", alt: "Project media pending", caption: "Media pending" });
    }).join("");
  return `<article class="engineering-project" aria-labelledby="project-${index}">
    <div class="engineering-project-heading"><h3 class="disp" id="project-${index}">${text(project.name)}</h3>
      <p class="engineering-status">${project.pending ? "Details pending" : text(project.status)}<br>${text(project.year || "Year pending")}</p></div>
    <p class="engineering-context">${text(project.role || "Role pending")}${project.context ? ` / ${text(project.context)}` : ""}</p>
    <p class="engineering-summary">${text(project.summary)}</p>
    ${specs}<p class="engineering-stack"><span>Stack</span> ${text(project.stack.length ? project.stack.join(" / ") : "Details pending")}</p>
    ${repo}${images}
  </article>`;
}
function render(data = content) {
  const blueprint = data.blueprint;
  return `<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Engineering — PJ Kim</title>
  <meta name="description" content="${escape(data.summary)}">
  <link rel="canonical" href="https://pjk1m.com/engineering">
  <link rel="icon" href="/images/logo.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/film/film.css"><link rel="stylesheet" href="/engineering/engineering.css">
</head><body class="film-page engineering-page">
  <a class="engineering-skip" href="#main">Skip to content</a>
  <header class="nav engineering-nav"><a href="/">WORK</a><nav class="nav-links" aria-label="Primary"><a href="/writing">WRITING</a><a href="/about">INFO</a></nav></header>
  <main id="main" tabindex="-1">
    <div class="engineering-intro">
      <nav class="engineering-breadcrumb" aria-label="Breadcrumb"><a href="/">work</a><span aria-hidden="true"> / </span><span aria-current="page">engineering</span></nav>
      <h1 class="disp">${escape(data.headline)}</h1>
      <p class="engineering-positioning">${escape(data.summary)}</p>
      <section class="engineering-capabilities" aria-label="Capabilities">${data.capabilities.map(item => `<div><h2>${escape(item.name)}</h2><p>${escape(item.summary)}</p></div>`).join("")}</section>
    </div>
    <section class="engineering-blueprint" aria-labelledby="blueprint-title">
      <div class="engineering-panel-heading"><h2 id="blueprint-title">${escape(blueprint.name)}</h2><span>Build sequence</span></div>
      <div class="engineering-blueprint-grid">
        ${drawing(blueprint.drawing)}
        <div><table class="engineering-sequence"><caption class="engineering-sr">Camera platform build sequence — milestones and periods pending confirmation</caption><tbody>${blueprint.milestones.map((item, index) => `<tr><td>${String(index + 1).padStart(2, "0")}</td><th scope="row">${escape(item.label)}</th><td>${escape(item.period)}</td></tr>`).join("")}</tbody></table><p class="engineering-sequence-note">${escape(blueprint.statement)}</p></div>
      </div>
      <div class="engineering-panel-footer"><span>${escape(blueprint.signature)}</span><span>${escape(blueprint.year || "Year pending")}</span></div>
    </section>
    <section class="engineering-datasheets" aria-labelledby="datasheets-title"><h2 id="datasheets-title">Project datasheets</h2>${data.projects.map(renderProject).join("")}</section>
    <p class="engineering-crosslink">The same practice, through another lens. <a href="/">Explore the film work <span aria-hidden="true">↗</span></a></p>
  </main>
  <footer class="monogram"><a href="/inspo">INSPO</a> · PJK1M</footer>
</body></html>`;
}
module.exports = render;
module.exports.renderProject = renderProject;
module.exports.publicationDigest = publicationDigest;
