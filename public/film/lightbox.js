// Still-gallery lightbox (vanilla JS, no framework).
// Any <figure> inside a .stills grid opens full-screen; PREV/NEXT walk the
// whole page's stills in document order. ESC / backdrop click closes.
(function () {
  "use strict";

  function init() {
    var figures = Array.prototype.slice.call(
      document.querySelectorAll(".stills figure")
    );
    if (!figures.length) return;

    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image viewer");
    lightbox.innerHTML =
      '<button class="lb-close" type="button" aria-label="Close">CLOSE</button>' +
      '<div class="lb-stage"><img alt=""></div>' +
      '<div class="lb-bar">' +
      '<button class="lb-prev" type="button" aria-label="Previous">PREV</button>' +
      '<span class="lb-count"></span>' +
      '<button class="lb-next" type="button" aria-label="Next">NEXT</button>' +
      "</div>" +
      '<p class="lb-caption"></p>';
    document.body.appendChild(lightbox);

    var img = lightbox.querySelector(".lb-stage img");
    var caption = lightbox.querySelector(".lb-caption");
    var count = lightbox.querySelector(".lb-count");
    var prevBtn = lightbox.querySelector(".lb-prev");
    var nextBtn = lightbox.querySelector(".lb-next");
    var closeBtn = lightbox.querySelector(".lb-close");

    var index = 0;

    function show(i) {
      index = ((i % figures.length) + figures.length) % figures.length;
      var fig = figures[index];
      var figImg = fig.querySelector("img");
      var figCap = fig.querySelector("figcaption");
      img.src = figImg.getAttribute("src");
      img.alt = figImg.getAttribute("alt") || "";
      caption.textContent = figCap ? figCap.textContent : "";
      count.textContent = index + 1 + " / " + figures.length;
    }

    function open(i) {
      show(i);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    figures.forEach(function (fig, i) {
      fig.addEventListener("click", function () {
        open(i);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () {
      show(index - 1);
    });
    nextBtn.addEventListener("click", function () {
      show(index + 1);
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
