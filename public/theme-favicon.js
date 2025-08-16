(function() {
  function setFavicon() {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = dark ? "%BASE_URL%favicon-white.png" : "%BASE_URL%favicon-black.png";
    document.head.appendChild(link);
  }
  setFavicon();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", setFavicon);
})();
