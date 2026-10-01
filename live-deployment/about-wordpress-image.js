(() => {
  const apply = () => {
    if (location.pathname !== '/about-us') return;
    const image = document.querySelector('img[alt="Swaralaya Sitar Silhouette"]');
    if (image && !image.src.endsWith('/about-joy-of-music.png')) image.src = '/about-joy-of-music.png';
  };

  new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ['src'], childList: true, subtree: true });
  apply();
})();
