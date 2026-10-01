(() => {
  const fixEmbeds = () => {
    document.querySelectorAll('iframe[src*="youtube.com/embed/"]').forEach(frame => {
      if (frame.dataset.referrerFixed) return;
      const source = frame.src;
      frame.dataset.referrerFixed = 'true';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.src = 'about:blank';
      queueMicrotask(() => { frame.src = source; });
    });
  };

  new MutationObserver(fixEmbeds).observe(document.documentElement, { childList: true, subtree: true });
  fixEmbeds();
})();
