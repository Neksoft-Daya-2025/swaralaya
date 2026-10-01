(() => {
  const routes = new Set(['/about-us', '/courses', '/benefits', '/upcoming-event']);
  const sync = () => document.body?.classList.toggle('swaralaya-common-banner', routes.has(location.pathname));
  const style = document.createElement('style');
  style.textContent = '.swaralaya-common-banner .page-banner{background-image:linear-gradient(rgba(35,17,10,.62),rgba(35,17,10,.62)),url("/common-page-banner.png")!important;background-position:center!important;background-size:cover!important}';
  document.head.append(style);
  new MutationObserver(sync).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', sync);
  sync();
})();
