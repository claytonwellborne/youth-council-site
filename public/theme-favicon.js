(function() {
  function setFavicon() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const href = prefersDark ? "%BASE_URL%favicon-white.png" : "%BASE_URL%favicon-black.png";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      document.head.appendChild(link);
    }
    if (link.href.endsWith("favicon-white.png") && !prefersDark) link.href = href;
    else if (link.href.endsWith("favicon-black.png") && prefersDark) link.href = href;
    else if (!link.href) link.href = href;
    // iOS home screen icon too:
    let apple = document.querySelector("link[rel='apple-touch-icon']");
    if (!apple) {
      apple = document.createElement("link");
      apple.rel = "apple-touch-icon";
      document.head.appendChild(apple);
    }
    apple.href = href;
  }
  setFavicon();
  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", setFavicon);
  } catch(_) {
    // Safari <14 fallback
    window.matchMedia("(prefers-color-scheme: dark)").addListener(setFavicon);
  }
})();
