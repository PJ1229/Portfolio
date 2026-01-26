// js/theme.js
(function () {
  const root = document.documentElement;

  // apply saved theme on load
  if (localStorage.theme === "dark") root.classList.add("dark");

  // button hookup (if present on page)
  window.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.textContent = root.classList.contains("dark") ? "◇" : "◆";

    toggle.addEventListener("click", () => {
      root.classList.toggle("dark");
      localStorage.theme = root.classList.contains("dark") ? "dark" : "light";
      toggle.textContent = root.classList.contains("dark") ? "◇" : "◆";
    });
  });
})();
