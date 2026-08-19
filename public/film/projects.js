// Project content model renderer (vanilla JS, no framework).
//
// Each project element carries its content model as data attributes:
//   data-type="EVENT,PROMO,FILM"  type[] — rendered as small mono tags
//   data-client="self"            "self" renders nothing; any other value
//                                 (e.g. "Michigan Athletics") renders a badge
//   data-status="IN PROGRESS"     status line
//   data-year="2026"              optional — appended to the status line
//
// Metadata is rendered into the element's [data-project-meta] child, so a
// project card/detail can grow (new types, client, status) by editing the
// attributes alone — no markup rebuild.
(function () {
  "use strict";

  function renderProjectMeta(project) {
    const meta = project.querySelector("[data-project-meta]");
    if (!meta) return;

    const types = (project.getAttribute("data-type") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const client = (project.getAttribute("data-client") || "self").trim();
    const status = (project.getAttribute("data-status") || "").trim();
    const year = (project.getAttribute("data-year") || "").trim();

    if (types.length) {
      const tags = document.createElement("ul");
      tags.className = "project-tags";
      types.forEach((type) => {
        const li = document.createElement("li");
        li.textContent = type;
        tags.appendChild(li);
      });
      meta.appendChild(tags);
    }

    if (client && client.toLowerCase() !== "self") {
      const badge = document.createElement("span");
      badge.className = "project-client";
      badge.textContent = client;
      meta.appendChild(badge);
    }

    if (status) {
      const statusLine = document.createElement("p");
      statusLine.className = "mono project-status";
      statusLine.textContent = year ? `${status} · ${year}` : status;
      meta.appendChild(statusLine);
    }
  }

  document.querySelectorAll("[data-type]").forEach(renderProjectMeta);
})();
