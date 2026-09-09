const test = require("node:test");
const assert = require("node:assert/strict");
const render = require("./render");
const content = require("./content");

test("uncleared project suppresses populated specifications, client, links and media", () => {
  const project = { ...content.projects[1], client: "Private Customer", specs: [{ label: "Speed", value: "SECRET-METRIC" }],
    summary: "Software for Private Customer.", stack: ["C++"],
    repo: "https://example.com/SECRET-REPO", media: [{ src: "/assets/engineering/SECRET-MEDIA.png", alt: "Private Customer", caption: "SECRET-CAPTION" }] };
  const html = render.renderProject(project, 0);
  for (const secret of ["Private Customer", "SECRET-METRIC", "SECRET-REPO", "SECRET-MEDIA", "SECRET-CAPTION"]) assert.ok(!html.includes(secret), secret);
  for (const publicValue of ["Yazaki", "Software engineering co-op", "C++", "Software for", project.redactedNote]) assert.ok(html.includes(publicValue));
  assert.ok(!html.includes("<table"));
});

test("content-only clearance and identity changes cannot publish restricted payloads", () => {
  for (const slug of ["yazaki", "camera-platform", "new-project"]) {
    const html = render.renderProject({ ...content.projects[1], slug, cleared: true, specs: [{ label: "Hidden", value: "SECRET" }], client: "PRIVATE" }, 0);
    assert.ok(!html.includes("SECRET"));
    assert.ok(!html.includes("PRIVATE"));
  }
});

test("content updates render, four projects exist, and HTML is escaped", () => {
  const data = structuredClone(content);
  data.projects[0].name = 'Changed <script>alert("x")</script>';
  const html = render(data);
  assert.equal((html.match(/<article /g) || []).length, 4);
  assert.ok(html.includes("Changed &lt;script&gt;"));
  assert.ok(!html.includes('<script>alert("x")</script>'));
  assert.ok(!html.includes('src=""'));
  assert.equal((html.match(/<h1 /g) || []).length, 1);
});

test("reviewed autolog specifications render and payload edits revoke clearance", () => {
  const project = content.projects.find(item => item.slug === "um-autolog");
  const html = render.renderProject(project, 2);
  assert.ok(html.includes('<table class="engineering-specs">'));
  assert.ok(html.includes("macOS / on-device processing"));
  assert.ok(html.includes("CSV log and dry-run rename script"));
  for (const changed of [
    { ...project, specs: [...project.specs, { label: "Unreviewed", value: "SECRET" }] },
    { ...project, repo: "https://example.com/SECRET" },
    { ...project, client: "SECRET" },
    { ...project, cleared: false },
  ]) {
    const output = render.renderProject(changed, 2);
    assert.ok(!output.includes("<table"));
    assert.ok(!output.includes("SECRET"));
  }
});
