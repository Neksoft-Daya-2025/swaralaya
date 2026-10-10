(() => {
  const videoId = 'RN81h85V6D4';
  const isHome = () => location.pathname === '/' || location.pathname === '';

  function removeHomeVideo() {
    if (!isHome()) return;
    document.querySelectorAll(`iframe[src*="${videoId}"]`).forEach(frame => {
      frame.closest('.video-card')?.remove();
    });
  }

  new MutationObserver(removeHomeVideo).observe(document.documentElement, { childList: true, subtree: true });
  removeHomeVideo();
  window.addEventListener('popstate', removeHomeVideo);
})();
