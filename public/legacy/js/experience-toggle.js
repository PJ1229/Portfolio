// js/experience-toggle.js
(function () {
  window.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".segmented-btn[data-view]");
    const entries = document.querySelectorAll(".exp-entry[data-type]");
    if (!buttons.length || !entries.length) return;

    function setView(view) {
      buttons.forEach(b => {
        const active = b.dataset.view === view;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });

      entries.forEach(entry => {
        entry.style.display = (entry.dataset.type === view) ? "block" : "none";
      });

      localStorage.exp_view = view;
    }

    const saved = localStorage.exp_view;
    setView(saved === "growth" ? "growth" : "swe");

    buttons.forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
  });
})();
