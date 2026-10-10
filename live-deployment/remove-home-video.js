(() => {
  const videoId = 'RN81h85V6D4';
  const selector = `iframe[src*="${videoId}"], iframe[title="Swaralaya School of Music"]`;
  const isHome = () => location.pathname === '/' || location.pathname === '';

  function removeHomeVideo() {
    if (!isHome()) return;
    document.querySelectorAll(selector).forEach(frame => {
      (frame.closest('.video-card, [class*="video-card"]') || frame.parentElement?.parentElement)?.remove();
    });
  }

  const style = document.createElement('style');
  style.textContent = `.video-card:has(${selector}),[class*="video-card"]:has(${selector}){display:none!important}`;
  document.head.append(style);
  new MutationObserver(removeHomeVideo).observe(document.documentElement, { childList: true, subtree: true });
  removeHomeVideo();
  window.addEventListener('popstate', removeHomeVideo);
})();
