(function () {
  const API = '/api/site-content';
  const LOGO_VERSION = '20260814151117';
  const DEFAULT_LOGO_URL = `/swaralaya-logo-hd.png?v=${LOGO_VERSION}`;
  const SCROLLED_LOGO_URL = `/swaralaya-logo-white.png?v=${LOGO_VERSION}`;
  const HOME_SPLASH_SEEN_KEY = 'swaralayaHomeSplashSeenThisSession';
  let content = null;
  let lastApplied = '';
  let applyQueued = false;

  function isAdmin() {
    return location.pathname.startsWith('/admin');
  }

  function showHomeFirstLoadSplash() {
    if (isAdmin() || (location.pathname !== '/' && location.pathname !== '')) {
      document.getElementById('swaralaya-home-splash')?.remove();
      document.getElementById('swaralaya-home-splash-style')?.remove();
      return;
    }

    const alreadyActive = window.__swaralayaHomeSplashActive === true;
    try {
      if (sessionStorage.getItem(HOME_SPLASH_SEEN_KEY) === '1' && !alreadyActive) {
        document.getElementById('swaralaya-home-splash')?.remove();
        document.getElementById('swaralaya-home-splash-style')?.remove();
        return;
      }
      sessionStorage.setItem(HOME_SPLASH_SEEN_KEY, '1');
    } catch {
      if (!alreadyActive) return;
    }

    if (!alreadyActive) {
      window.__swaralayaHomeSplashActive = true;
    }

    let style = document.getElementById('swaralaya-home-splash-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'swaralaya-home-splash-style';
      style.textContent = `
      #swaralaya-home-splash {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #fff;
        opacity: 1;
        transition: opacity 420ms ease, visibility 420ms ease;
        overflow: hidden;
      }

      #swaralaya-home-splash.is-hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }

      #swaralaya-home-splash img {
        width: min(330px, 52vw);
        max-height: 42vh;
        height: auto;
        object-fit: contain;
        filter: none !important;
        animation: swaralayaSplashLogo 900ms ease both;
      }

      @media (max-width: 640px) {
        #swaralaya-home-splash img {
          width: min(250px, 66vw);
          max-height: 38vh;
        }
      }

      @keyframes swaralayaSplashLogo {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
      document.head.appendChild(style);
    }

    let splash = document.getElementById('swaralaya-home-splash');
    if (!splash) {
      splash = document.createElement('div');
      splash.id = 'swaralaya-home-splash';
      splash.setAttribute('aria-label', 'Swaralaya loading');
      splash.innerHTML = '<img src="/swaralaya-loader-saras.gif" alt="Swaralaya School of Music" />';
      document.body.appendChild(splash);
    }

    const hide = () => {
      splash.classList.add('is-hidden');
      window.setTimeout(() => {
        splash.remove();
        style.remove();
      }, 520);
    };

    window.setTimeout(hide, 2000);
  }

  function safeQuery(selector) {
    try {
      return Array.from(document.querySelectorAll(selector));
    } catch {
      return [];
    }
  }

  function ensureViewportMeta() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.prepend(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
  }

  function markMobileDevice() {
    const candidates = [
      window.innerWidth,
      window.visualViewport?.width,
    ].filter((value) => Number.isFinite(value) && value > 0);
    const realWidth = candidates.length ? Math.min(...candidates) : window.innerWidth;
    const narrow = Number.isFinite(realWidth) && realWidth <= 900;
    if (narrow) {
      document.documentElement.style.setProperty('--swaralaya-mobile-width', `${Math.max(280, Math.round(realWidth))}px`);
    } else {
      document.documentElement.style.removeProperty('--swaralaya-mobile-width');
    }
    document.body?.classList.toggle('swaralaya-mobile-device', narrow);
  }

  function applyLogo(logoUrl) {
    const header = document.querySelector('.header-area');
    const isScrolledHeader = Boolean(header && header.classList.contains('scrolled'));
    const url = isScrolledHeader ? SCROLLED_LOGO_URL : (logoUrl || DEFAULT_LOGO_URL);
    safeQuery('img').forEach((img) => {
      if (img.closest('#swaralaya-home-splash')) return;
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      if (/logo/i.test(src) || /logo/i.test(alt) || img.matches('.navbar-logo img')) {
        if (img.getAttribute('src') !== url) {
          img.src = url;
        }
        if (img.style.filter !== 'none') img.style.filter = 'none';
        if (img.style.objectFit !== 'contain') img.style.objectFit = 'contain';
      }
    });
    safeQuery('.header-area.scrolled .navbar-logo img, .navbar-logo img').forEach((img) => {
      if (img.style.filter !== 'none') img.style.filter = 'none';
      if (img.style.background !== 'transparent') img.style.background = 'transparent';
    });
  }

  function scheduleApply() {
    if (applyQueued) return;
    applyQueued = true;
    requestAnimationFrame(() => {
      applyQueued = false;
      applyRules();
      addEventsNavLink();
      addGalleryNavLink();
      fixYouTubeEmbeds();
      addAdminContentLink();
      normalizeMobileCarousels();
    });
  }

  function ensureMobileNavStyles() {
    if (document.getElementById('swaralaya-mobile-nav-fix')) return;
    const style = document.createElement('style');
    style.id = 'swaralaya-mobile-nav-fix';
    style.textContent = `
      html,
      body {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: clip !important;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      img,
      video,
      canvas,
      svg {
        max-width: 100%;
      }

      .header-area,
      .header-area .container,
      .header-area .navbar {
        max-width: 100vw !important;
      }

      .header-area .navbar {
        min-width: 0 !important;
      }

      .header-area .navbar-logo {
        flex: 0 1 auto !important;
        min-width: 0 !important;
        margin-left: 34px !important;
      }

      .header-area .navbar-logo img {
        display: block !important;
        width: auto !important;
        max-width: min(230px, 48vw) !important;
        height: auto !important;
        max-height: 86px !important;
        object-fit: contain !important;
      }

      .swaralaya-mobile-device,
      .swaralaya-mobile-device #root,
      .swaralaya-mobile-device main,
      .swaralaya-mobile-device section,
      .swaralaya-mobile-device .container {
        max-width: min(100vw, var(--swaralaya-mobile-width, 100vw)) !important;
        overflow-x: clip !important;
      }

      .swaralaya-mobile-device .container,
      .swaralaya-mobile-device section .container,
      .swaralaya-mobile-device main .container {
        width: min(calc(var(--swaralaya-mobile-width, 100vw) - 24px), 760px) !important;
        max-width: calc(var(--swaralaya-mobile-width, 100vw) - 24px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .swaralaya-mobile-device .header-area .container {
        width: 100% !important;
        max-width: min(100vw, var(--swaralaya-mobile-width, 100vw)) !important;
        padding-left: 14px !important;
        padding-right: 14px !important;
      }

      .swaralaya-mobile-device .header-area .navbar {
        min-height: 64px !important;
        gap: 12px !important;
      }

      .swaralaya-mobile-device .header-area .navbar-logo {
        margin-left: 4px !important;
      }

      .swaralaya-mobile-device .header-area .navbar-logo img {
        max-width: min(154px, 56vw) !important;
        max-height: 54px !important;
      }

      .swaralaya-mobile-device .header-area .nav-toggle {
        position: relative !important;
        z-index: 10002 !important;
        flex: 0 0 42px !important;
        width: 42px !important;
        height: 42px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 999px !important;
        background: transparent !important;
        box-shadow: none !important;
        border: 0 !important;
      }

      .swaralaya-mobile-device .header-area .nav-menu {
        display: none !important;
      }

      .swaralaya-mobile-device .header-area .nav-menu.open,
      .swaralaya-mobile-device .header-area .nav-toggle.active + .nav-menu,
      .swaralaya-mobile-device .header-area .nav-menu.is-open {
        position: fixed !important;
        left: 0 !important;
        right: 0 !important;
        top: 60px !important;
        width: 100vw !important;
        max-width: 100vw !important;
        max-height: calc(100vh - 60px) !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 0 !important;
        padding: 10px 14px 18px !important;
        overflow-y: auto !important;
        background: #fff !important;
        box-shadow: 0 18px 36px rgba(31, 18, 12, 0.16) !important;
        transform: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        z-index: 10000 !important;
      }

      .swaralaya-mobile-device .about-grid,
      .swaralaya-mobile-device .event-grid,
      .swaralaya-mobile-device .contact-grid,
      .swaralaya-mobile-device .courses-grid,
      .swaralaya-mobile-device .benefits-grid,
      .swaralaya-mobile-device .events-grid,
      .swaralaya-mobile-device .blogs-grid,
      .swaralaya-mobile-device .gallery-grid,
      .swaralaya-mobile-device .video-grid,
      .swaralaya-mobile-device .videos-grid,
      .swaralaya-mobile-device .instagram-grid,
      .swaralaya-mobile-device .insta-grid,
      .swaralaya-mobile-device [style*="grid-template-columns"] {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 22px !important;
        max-width: 100% !important;
      }

      .swaralaya-mobile-device [style*="display: flex"],
      .swaralaya-mobile-device [style*="display:flex"] {
        max-width: 100% !important;
      }

      .swaralaya-mobile-device h1,
      .swaralaya-mobile-device h2,
      .swaralaya-mobile-device h3,
      .swaralaya-mobile-device .main-title,
      .swaralaya-mobile-device .hero-title,
      .swaralaya-mobile-device .section-title {
        max-width: 100% !important;
        white-space: normal !important;
        word-break: normal !important;
        overflow-wrap: normal !important;
        line-height: 1.15 !important;
      }

      .swaralaya-mobile-device .hero-title,
      .swaralaya-mobile-device .main-title {
        font-size: clamp(26px, 8vw, 38px) !important;
      }

      .swaralaya-mobile-device p,
      .swaralaya-mobile-device a,
      .swaralaya-mobile-device span,
      .swaralaya-mobile-device li {
        max-width: 100% !important;
        overflow-wrap: anywhere !important;
      }

      .swaralaya-mobile-device img,
      .swaralaya-mobile-device iframe,
      .swaralaya-mobile-device video {
        max-width: 100% !important;
      }

      .swaralaya-mobile-device .video-thumb,
      .swaralaya-mobile-device .swaralaya-video-fallback {
        width: 100% !important;
        aspect-ratio: 16 / 9 !important;
      }

      .swaralaya-mobile-device .swaralaya-mobile-insta-track {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 10px !important;
        width: 100% !important;
        max-width: 100% !important;
        transform: none !important;
        transition: none !important;
        overflow: visible !important;
      }

      .swaralaya-mobile-device .swaralaya-mobile-insta-track > .insta-item {
        flex: none !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        aspect-ratio: 1 / 1 !important;
      }

      .swaralaya-mobile-device .swaralaya-mobile-insta-track > .insta-item img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }

      .swaralaya-mobile-device .swaralaya-mobile-carousel-shell {
        max-width: 100% !important;
        overflow: hidden !important;
      }

      .swaralaya-mobile-device .swaralaya-mobile-carousel-shell > button {
        display: none !important;
      }

      .swaralaya-mobile-device button[aria-label="Previous"],
      .swaralaya-mobile-device button[aria-label="Next"] {
        display: none !important;
      }

      .swaralaya-mobile-device footer,
      .swaralaya-mobile-device footer .container,
      .swaralaya-mobile-device footer .footer-grid,
      .swaralaya-mobile-device footer [style*="grid-template-columns"] {
        width: 100% !important;
        max-width: min(100vw, var(--swaralaya-mobile-width, 100vw)) !important;
        grid-template-columns: 1fr !important;
      }

      footer .container,
      footer .footer-grid {
        max-width: 100% !important;
      }

      footer .footer-grid > * {
        min-width: 0 !important;
      }

      @media (max-width: 1180px) {
        .header-area .container,
        footer .container,
        section .container,
        main .container {
          width: min(100% - 32px, 1120px) !important;
          max-width: calc(100vw - 32px) !important;
        }

        .header-area .nav-menu {
          gap: 18px !important;
        }

        footer .footer-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 28px !important;
        }
      }

      @media (max-width: 1100px) {
        .header-area {
          overflow-x: clip !important;
        }

        .header-area .container {
          width: 100% !important;
          max-width: 100vw !important;
          padding-left: 18px !important;
          padding-right: 18px !important;
        }

        .header-area .navbar {
          gap: 14px !important;
          min-width: 0 !important;
        }

        .header-area .navbar-logo {
          min-width: 0 !important;
          margin-left: 0 !important;
        }

        .header-area .navbar-logo img {
          max-width: min(230px, 52vw) !important;
          max-height: 76px !important;
        }

        .header-area .nav-toggle {
          position: relative !important;
          z-index: 10002 !important;
          flex: 0 0 44px !important;
          width: 44px !important;
          height: 44px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }

        .header-area .nav-menu {
          display: none !important;
        }

        .header-area .nav-menu.open,
        .header-area .nav-toggle.active + .nav-menu,
        .header-area .nav-menu.is-open {
          position: fixed !important;
          left: 0 !important;
          right: 0 !important;
          top: 72px !important;
          width: 100vw !important;
          max-width: 100vw !important;
          max-height: calc(100vh - 72px) !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 0 !important;
          padding: 10px 18px 18px !important;
          overflow-y: auto !important;
          background: #fff !important;
          box-shadow: 0 18px 36px rgba(31, 18, 12, 0.16) !important;
          transform: none !important;
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 10000 !important;
        }

        .header-area .nav-menu.open li,
        .header-area .nav-menu.is-open li {
          width: 100% !important;
        }

        .header-area .nav-menu.open a,
        .header-area .nav-menu.is-open a {
          width: 100% !important;
          min-height: 44px !important;
          display: flex !important;
          align-items: center !important;
          padding: 12px 14px !important;
          color: #2b211d !important;
          background: transparent !important;
        }

        .header-area .nav-menu.open .btn-enroll,
        .header-area .nav-menu.is-open .btn-enroll {
          justify-content: center !important;
          color: #fff !important;
          background: #6f3527 !important;
        }

        section .container,
        main .container,
        .container {
          width: min(100% - 32px, 980px) !important;
          max-width: calc(100vw - 32px) !important;
        }

        .about-grid,
        .event-grid,
        .contact-grid,
        .courses-grid,
        .benefits-grid,
        .events-grid,
        .blogs-grid,
        .gallery-grid,
        .video-grid,
        .videos-grid,
        .section .container > [style*="grid-template-columns"],
        main .container > [style*="grid-template-columns"] {
          grid-template-columns: 1fr !important;
          max-width: 100% !important;
          min-width: 0 !important;
        }

        .fade-in-left,
        .fade-in-right,
        .about-image-wrap,
        .about-content {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          transform: none !important;
        }

        .instagram-grid,
        .insta-grid {
          display: grid !important;
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          gap: 8px !important;
          max-width: 100% !important;
          overflow: hidden !important;
        }

        .instagram-grid .insta-item,
        .insta-grid .insta-item {
          width: 100% !important;
          max-width: 100% !important;
          left: auto !important;
          right: auto !important;
        }
      }

      @media (max-width: 900px) {
        section .container,
        main .container,
        .container {
          width: min(100% - 28px, 760px) !important;
          max-width: calc(100vw - 28px) !important;
        }

        .about-image-wrap,
        .about-grid,
        .fade-in-left,
        .fade-in-right,
        .about-content,
        .about-tabs,
        .about-check-grid,
        .benefit-card,
        .course-card,
        .event-card,
        .blog-card,
        .contact-card,
        .contact-form,
        .enroll-form {
          max-width: 100% !important;
          min-width: 0 !important;
        }

        .about-grid,
        .section .container > [style*="grid-template-columns"],
        main .container > [style*="grid-template-columns"] {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 28px !important;
          align-items: stretch !important;
        }

        .fade-in-left,
        .fade-in-right {
          transform: none !important;
          width: 100% !important;
          justify-self: stretch !important;
        }

        .about-tabs,
        .about-check-grid {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 10px !important;
        }

        .about-tabs button {
          width: 100% !important;
          justify-content: center !important;
          white-space: normal !important;
        }

        footer {
          padding: 44px 0 18px !important;
        }

        footer .footer-grid {
          grid-template-columns: 1fr !important;
          gap: 26px !important;
          padding-bottom: 34px !important;
        }

        footer .footer-grid img {
          max-width: 210px !important;
          height: auto !important;
        }

        footer a,
        footer span,
        footer p {
          overflow-wrap: anywhere !important;
        }
      }

      @media (max-width: 900px) {
        html,
        body {
          overflow-x: hidden !important;
        }

        body.swaralaya-menu-open {
          overflow: hidden !important;
        }

        .header-area {
          position: sticky !important;
          top: 0 !important;
          z-index: 9999 !important;
        }

        .header-area .container {
          width: 100% !important;
          max-width: 100vw !important;
          padding-left: 14px !important;
          padding-right: 14px !important;
        }

        .header-area .navbar {
          min-height: 64px !important;
          gap: 12px !important;
        }

        .header-area .navbar-logo img {
          max-width: min(172px, 58vw) !important;
          max-height: 54px !important;
        }

        .header-area .navbar-logo {
          margin-left: 4px !important;
        }

        .header-area .nav-toggle {
          position: relative !important;
          z-index: 10002 !important;
          flex: 0 0 42px !important;
          width: 42px !important;
          height: 42px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 999px !important;
          background: #fff !important;
        }

        .header-area .nav-menu {
          display: none !important;
        }

        .header-area .nav-menu.open,
        .header-area .nav-toggle.active + .nav-menu,
        .header-area .nav-menu.is-open {
          position: fixed !important;
          left: 0 !important;
          right: 0 !important;
          top: 60px !important;
          width: 100vw !important;
          max-width: 100vw !important;
          height: auto !important;
          max-height: calc(100vh - 60px) !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 0 !important;
          padding: 10px 14px 18px !important;
          overflow-y: auto !important;
          background: #fff !important;
          border-top: 1px solid rgba(111, 53, 39, 0.12) !important;
          box-shadow: 0 18px 36px rgba(31, 18, 12, 0.16) !important;
          transform: none !important;
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 10000 !important;
        }

        .header-area .nav-menu.open li,
        .header-area .nav-menu.is-open li {
          width: 100% !important;
          display: block !important;
        }

        .header-area .nav-menu.open a,
        .header-area .nav-menu.is-open a {
          width: 100% !important;
          min-height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          padding: 12px 14px !important;
          border-radius: 8px !important;
          color: #2b211d !important;
          background: transparent !important;
          font-size: 15px !important;
          line-height: 1.2 !important;
          text-decoration: none !important;
        }

        .header-area .nav-menu.open a.active,
        .header-area .nav-menu.open a:hover,
        .header-area .nav-menu.is-open a.active,
        .header-area .nav-menu.is-open a:hover {
          color: #6f3527 !important;
          background: rgba(111, 53, 39, 0.08) !important;
        }

        .header-area .nav-menu.open .btn-enroll,
        .header-area .nav-menu.is-open .btn-enroll {
          margin-top: 6px !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          max-width: 100% !important;
          justify-content: center !important;
          color: #fff !important;
          background: #6f3527 !important;
        }

        main,
        section {
          max-width: 100vw !important;
          overflow-x: clip !important;
        }

        h1,
        h2,
        h3,
        .main-title,
        .section-title {
          max-width: 100% !important;
          overflow-wrap: anywhere !important;
          line-height: 1.15 !important;
        }

        .main-title {
          font-size: clamp(28px, 9vw, 40px) !important;
        }

        p {
          max-width: 100% !important;
          overflow-wrap: anywhere !important;
        }

        .about-image-wrap img {
          width: 100% !important;
          height: auto !important;
          object-fit: cover !important;
        }

        .new-course-card,
        .courses-grid,
        .benefits-grid,
        .events-grid,
        .blogs-grid,
        .gallery-grid,
        .video-grid,
        .videos-section,
        .videos-section .container,
        .videos-section .section-title,
        .videos-section .main-title,
        .insta-grid,
        .instagram-grid {
          max-width: 100% !important;
          min-width: 0 !important;
        }

        .videos-section {
          width: 100% !important;
          overflow: hidden !important;
          background-size: cover !important;
          background-position: center !important;
        }

        .videos-section .container {
          width: min(100% - 28px, 760px) !important;
          max-width: calc(100vw - 28px) !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .videos-section .section-title {
          width: 100% !important;
          max-width: 100% !important;
          margin-left: auto !important;
          margin-right: auto !important;
          text-align: center !important;
        }

        .videos-section .section-title h1,
        .videos-section .section-title h2,
        .videos-section .section-title .main-title,
        .videos-section .main-title {
          width: 100% !important;
          max-width: 100% !important;
          margin-left: auto !important;
          margin-right: auto !important;
          text-align: center !important;
          white-space: normal !important;
          word-break: normal !important;
          overflow-wrap: normal !important;
          font-size: clamp(28px, 8vw, 42px) !important;
          line-height: 1.12 !important;
        }

        .videos-section .sm-title {
          display: block !important;
          width: 100% !important;
          text-align: center !important;
          letter-spacing: .08em !important;
        }

        .courses-grid,
        .benefits-grid,
        .events-grid,
        .blogs-grid,
        .gallery-grid,
        .video-grid {
          grid-template-columns: 1fr !important;
        }

        .insta-grid,
        .instagram-grid,
        [class*="instagram"],
        [class*="insta"] {
          overflow: hidden !important;
          max-width: 100vw !important;
        }

        .insta-grid,
        .instagram-grid,
        .gallery-grid,
        [class*="instagram"] [class*="grid"],
        [class*="insta"] [class*="grid"] {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 10px !important;
          width: 100% !important;
          max-width: 100% !important;
          transform: none !important;
        }

        .insta-grid > *,
        .instagram-grid > *,
        .gallery-grid > *,
        [class*="instagram"] [class*="item"],
        [class*="insta"] [class*="item"] {
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          height: auto !important;
          left: auto !important;
          right: auto !important;
          transform: none !important;
        }

        .insta-grid img,
        .instagram-grid img,
        .gallery-grid img,
        [class*="instagram"] img,
        [class*="insta"] img {
          width: 100% !important;
          height: 100% !important;
          aspect-ratio: 1 / 1 !important;
          object-fit: cover !important;
        }

        .slick-list,
        .slick-track,
        .owl-stage-outer,
        .owl-stage,
        .swiper,
        .swiper-wrapper,
        [class*="carousel"],
        [class*="slider"] {
          max-width: 100% !important;
          overflow: hidden !important;
        }

        .slick-track,
        .owl-stage,
        .swiper-wrapper,
        [class*="carousel-track"],
        [class*="slider-track"] {
          transform: none !important;
        }

        .slick-slide,
        .owl-item,
        .swiper-slide,
        [class*="carousel"] > *,
        [class*="slider"] > * {
          min-width: 0 !important;
          max-width: 100% !important;
        }

        .slick-arrow,
        .owl-nav button,
        .swiper-button-prev,
        .swiper-button-next,
        [class*="carousel"] button[aria-label*="Previous"],
        [class*="carousel"] button[aria-label*="Next"],
        [class*="slider"] button[aria-label*="Previous"],
        [class*="slider"] button[aria-label*="Next"] {
          display: none !important;
        }

        footer [style*="grid-template-columns"],
        footer .footer-grid {
          grid-template-columns: 1fr !important;
        }

        footer [style*="justify-content: space-between"] {
          align-items: flex-start !important;
        }
      }

      @media (max-width: 520px) {
        section .container,
        main .container,
        .container {
          width: min(100% - 24px, 480px) !important;
          max-width: calc(100vw - 24px) !important;
        }

        .header-area .navbar-logo img {
          max-width: min(154px, 56vw) !important;
        }

        .insta-grid,
        .instagram-grid,
        .gallery-grid,
        [class*="instagram"] [class*="grid"],
        [class*="insta"] [class*="grid"],
        .swaralaya-mobile-device .swaralaya-mobile-insta-track {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
        }

        .btn,
        button,
        input,
        select,
        textarea {
          max-width: 100% !important;
        }

        footer h2 {
          font-size: 24px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeMobileCarousels() {
    const mobile = document.body?.classList.contains('swaralaya-mobile-device');
    safeQuery('.swaralaya-mobile-insta-track').forEach((el) => {
      if (!mobile) el.classList.remove('swaralaya-mobile-insta-track');
    });
    safeQuery('.swaralaya-mobile-carousel-shell').forEach((el) => {
      if (!mobile) el.classList.remove('swaralaya-mobile-carousel-shell');
    });
    if (!mobile) return;

    safeQuery('.insta-item').forEach((item) => {
      const track = item.parentElement;
      if (!track) return;
      track.classList.add('swaralaya-mobile-insta-track');
      const shell = track.parentElement;
      if (shell) shell.classList.add('swaralaya-mobile-carousel-shell');
    });
  }

  function ensureVideoFallbacks() {
    if (isAdmin()) return;
    if (document.getElementById('swaralaya-video-fallback-style')) return;
    const style = document.createElement('style');
    style.id = 'swaralaya-video-fallback-style';
    style.textContent = `
      .videos-section .video-thumb {
        position: relative !important;
        background: #1f1f1f !important;
        border-radius: 8px !important;
        overflow: hidden !important;
      }

      .videos-section .swaralaya-video-fallback {
        position: absolute !important;
        inset: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 100% !important;
        color: #fff !important;
        background: #2a211f !important;
        border: 0 !important;
        cursor: pointer !important;
        padding: 0 !important;
        text-align: center !important;
      }

      .videos-section .swaralaya-video-fallback img {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        opacity: .78 !important;
        transform: scale(1.01) !important;
        transition: transform .35s ease, opacity .35s ease !important;
      }

      .videos-section .swaralaya-video-fallback::before {
        content: "" !important;
        position: absolute !important;
        inset: 0 !important;
        background: linear-gradient(180deg, rgba(20, 14, 12, .14), rgba(20, 14, 12, .62)) !important;
        z-index: 1 !important;
      }

      .videos-section .swaralaya-video-fallback:hover img {
        opacity: .92 !important;
        transform: scale(1.06) !important;
      }

      .videos-section .swaralaya-video-play {
        position: relative !important;
        z-index: 2 !important;
        width: 68px !important;
        height: 68px !important;
        border-radius: 999px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: #fff !important;
        color: #7a3728 !important;
        box-shadow: 0 18px 40px rgba(0, 0, 0, .28) !important;
      }

      .videos-section .swaralaya-video-play svg {
        width: 26px !important;
        height: 26px !important;
        margin-left: 4px !important;
      }

      .videos-section .swaralaya-video-label {
        position: absolute !important;
        left: 18px !important;
        right: 18px !important;
        bottom: 16px !important;
        z-index: 2 !important;
        color: #fff !important;
        font-weight: 800 !important;
        font-size: 15px !important;
        line-height: 1.25 !important;
        text-shadow: 0 2px 12px rgba(0, 0, 0, .45) !important;
      }
    `;
    document.head.appendChild(style);
  }

  function getYouTubeId(src) {
    try {
      const url = new URL(src, window.location.href);
      if (url.hostname.includes('youtu.be')) return url.pathname.split('/').filter(Boolean)[0] || '';
      if (url.searchParams.get('v')) return url.searchParams.get('v') || '';
      const match = url.pathname.match(/\/embed\/([^/?#]+)/);
      return match ? match[1] : '';
    } catch {
      const match = String(src || '').match(/(?:embed\/|youtu\.be\/|v=)([A-Za-z0-9_-]{6,})/);
      return match ? match[1] : '';
    }
  }

  function fixYouTubeEmbeds() {
    if (isAdmin()) return;
    ensureVideoFallbacks();
    safeQuery('.videos-section iframe[src*="youtube"], .videos-section iframe[src*="youtu.be"]').forEach((iframe) => {
      const id = getYouTubeId(iframe.getAttribute('src') || iframe.src);
      if (!id) return;
      const thumb = iframe.closest('.video-thumb') || iframe.parentElement;
      if (!thumb || thumb.querySelector('.swaralaya-video-fallback')) {
        iframe.remove();
        return;
      }

      const title = iframe.getAttribute('title') || 'Watch Swaralaya video';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'swaralaya-video-fallback';
      button.setAttribute('aria-label', `${title} on YouTube`);
      button.innerHTML = `
        <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${title.replace(/"/g, '&quot;')}" loading="lazy" />
        <span class="swaralaya-video-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
        </span>
        <span class="swaralaya-video-label">${title}</span>
      `;
      button.addEventListener('click', () => {
        window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`, '_blank', 'noopener,noreferrer');
      });
      iframe.replaceWith(button);
    });
  }

  function ensureLogoContrastStyles() {
    if (document.getElementById('swaralaya-logo-contrast-fix')) return;
    const style = document.createElement('style');
    style.id = 'swaralaya-logo-contrast-fix';
    style.textContent = `
      .header-area.scrolled .navbar-logo img,
      .header-area.scrolled header img,
      header.scrolled .navbar-logo img {
        filter: brightness(0) invert(1) contrast(1.16) !important;
        opacity: 1 !important;
        mix-blend-mode: normal !important;
      }

      .header-area:not(.scrolled) .navbar-logo img {
        filter: none !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function addNavLinkOnce(config) {
    if (isAdmin()) return;

    const navSelectors = [
      '.navbar-nav',
      '.main-menu',
      '.navigation',
      'nav ul',
      '.header-area ul',
    ];
    const nav = navSelectors.map((selector) => document.querySelector(selector)).find(Boolean);
    if (!nav || nav.querySelector(`[${config.dataAttr}="true"]`)) return;

    const existingLinks = Array.from(nav.querySelectorAll('a'));
    if (existingLinks.some((link) => config.exists(link))) return;

    const sampleItem = nav.querySelector('li');
    const item = sampleItem ? sampleItem.cloneNode(false) : document.createElement('li');
    item.setAttribute(config.dataAttr, 'true');

    const link = document.createElement('a');
    link.href = config.href;
    link.textContent = config.label;
    link.setAttribute(config.dataAttr, 'true');
    link.className = existingLinks[0]?.className || '';
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    item.appendChild(link);

    const before = existingLinks.find((link) => config.before.test(link.textContent || ''))?.closest('li');
    if (before && before.parentElement === nav) {
      nav.insertBefore(item, before);
    } else {
      nav.appendChild(item);
    }
  }

  function normalizeNavActiveState() {
    if (isAdmin()) return;
    const currentPath = location.pathname.replace(/\/+$/, '') || '/';
    safeQuery('.header-area a, nav a').forEach((link) => {
      const text = (link.textContent || '').trim();
      const href = link.getAttribute('href') || '';
      let path = '';
      try {
        path = new URL(href, window.location.origin).pathname.replace(/\/+$/, '') || '/';
      } catch {
        path = href.replace(/\/+$/, '') || '/';
      }

      const shouldBeActive = path === currentPath || (currentPath === '/' && /^home$/i.test(text));
      if (/^(events|gallery)$/i.test(text) && path !== currentPath) {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        link.style.color = '';
      } else if (shouldBeActive) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (link.classList.contains('active') && path !== currentPath) {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function addEventsNavLink() {
    if (!isAdmin()) {
      safeQuery('.header-area a, nav a').forEach((link) => {
        const text = (link.textContent || '').trim();
        if (/^events?$/i.test(text)) {
          link.setAttribute('href', '/upcoming-event');
        }
      });
    }

    addNavLinkOnce({
      dataAttr: 'data-swaralaya-events-link',
      href: '/upcoming-event',
      label: 'Events',
      before: /gallery|blogs?|contact/i,
      exists: (link) => /events?/i.test(link.textContent || '') || link.getAttribute('href') === '/upcoming-event',
    });
  }

  function addGalleryNavLink() {
    addNavLinkOnce({
      dataAttr: 'data-swaralaya-gallery-link',
      href: '/gallery',
      label: 'Gallery',
      before: /blogs?|contact/i,
      exists: (link) => /gallery/i.test(link.textContent || '') || link.getAttribute('href') === '/gallery',
    });
  }

  function cleanGalleryCards() {
    const gallery = document.getElementById('swaralaya-gallery-page');
    if (!gallery) return;
    gallery.querySelectorAll('figcaption').forEach((caption) => caption.remove());
    gallery.querySelectorAll('figure').forEach((card) => {
      const src = card.querySelector('img')?.getAttribute('src') || '';
      if (!src || /swaralaya-logo-hd\.png(?:\?|$)/i.test(src)) card.remove();
    });
  }

  function ensureGalleryLightbox() {
    if (document.getElementById('swaralaya-gallery-lightbox')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'swaralaya-gallery-lightbox';
    dialog.innerHTML = '<button type="button" class="gallery-close" aria-label="Close image">×</button><button type="button" class="gallery-prev" aria-label="Previous image">‹</button><img alt="" /><button type="button" class="gallery-next" aria-label="Next image">›</button>';
    const style = document.createElement('style');
    style.textContent = '#swaralaya-gallery-page figure{cursor:zoom-in}#swaralaya-gallery-page figure:hover img{transform:scale(1.03)}#swaralaya-gallery-page img{transition:transform .2s ease}#swaralaya-gallery-lightbox{position:fixed;inset:0;margin:auto;width:fit-content;height:fit-content;max-width:96vw;max-height:94vh;padding:0;border:0;background:transparent;overflow:visible}#swaralaya-gallery-lightbox::backdrop{background:rgba(0,0,0,.82)}#swaralaya-gallery-lightbox img{display:block;max-width:96vw;max-height:92vh;object-fit:contain}#swaralaya-gallery-lightbox button{position:absolute;border:0;border-radius:50%;width:40px;height:40px;background:#fff;color:#333;font-size:30px;line-height:1;cursor:pointer}#swaralaya-gallery-lightbox .gallery-close{top:-48px;right:0}#swaralaya-gallery-lightbox .gallery-prev,#swaralaya-gallery-lightbox .gallery-next{top:50%;transform:translateY(-50%)}#swaralaya-gallery-lightbox .gallery-prev{left:-52px}#swaralaya-gallery-lightbox .gallery-next{right:-52px}@media(max-width:700px){#swaralaya-gallery-lightbox .gallery-prev{left:8px}#swaralaya-gallery-lightbox .gallery-next{right:8px}}';
    document.head.append(style);
    document.body.append(dialog);
    let currentIndex = 0;
    const preview = dialog.querySelector('img');
    const showImage = index => {
      const images = [...document.querySelectorAll('#swaralaya-gallery-page .gallery-grid img')];
      if (!images.length) return;
      currentIndex = (index + images.length) % images.length;
      const image = images[currentIndex];
      preview.src = image.currentSrc || image.src;
      preview.alt = image.alt;
    };
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.querySelector('.gallery-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.gallery-prev').addEventListener('click', () => showImage(currentIndex - 1));
    dialog.querySelector('.gallery-next').addEventListener('click', () => showImage(currentIndex + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    });
    document.addEventListener('click', event => {
      const image = event.target.closest('#swaralaya-gallery-page .gallery-grid img');
      if (!image) return;
      showImage([...document.querySelectorAll('#swaralaya-gallery-page .gallery-grid img')].indexOf(image));
      dialog.showModal();
    });
  }

  function fixMissingMarketingRoutes() {
    if (location.pathname === '/events') {
      location.replace('/upcoming-event');
      return;
    }

    const existingGallery = document.getElementById('swaralaya-gallery-page');
    if (location.pathname !== '/gallery') {
      existingGallery?.remove();
      return;
    }
    if (existingGallery) {
      cleanGalleryCards();
      return;
    }

    const main = document.querySelector('main') || document.querySelector('#root') || document.body;
    if (!main) return;

    const section = document.createElement('section');
    section.id = 'swaralaya-gallery-page';
    section.innerHTML = `
      <style>
        #swaralaya-gallery-page {
          background: #fbfaf8;
          color: #2b211d;
          min-height: 58vh;
          padding: 92px 20px 100px;
        }

        #swaralaya-gallery-page .gallery-wrap {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        #swaralaya-gallery-page .gallery-kicker {
          color: #7a3728;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          font-size: 13px;
          margin-bottom: 12px;
        }

        #swaralaya-gallery-page h1 {
          margin: 0 0 14px;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(38px, 5vw, 64px);
          line-height: 1.05;
          color: #713426;
          letter-spacing: 0;
        }

        #swaralaya-gallery-page .gallery-copy {
          max-width: 680px;
          color: #655d59;
          font-size: 18px;
          line-height: 1.7;
          margin: 0 0 42px;
        }

        #swaralaya-gallery-page .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        #swaralaya-gallery-page figure {
          margin: 0;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
          border: 1px solid rgba(113, 52, 38, .14);
          box-shadow: 0 16px 38px rgba(43, 33, 29, .08);
        }

        #swaralaya-gallery-page img {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: contain;
          background: #f7f4f1;
        }

        #swaralaya-gallery-page figcaption {
          padding: 14px 16px 16px;
          font-weight: 800;
          color: #713426;
        }

        @media (max-width: 900px) {
          #swaralaya-gallery-page {
            padding: 70px 16px 80px;
          }

          #swaralaya-gallery-page .gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          #swaralaya-gallery-page .gallery-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <div class="gallery-wrap">
        <div class="gallery-kicker">Swaralaya Moments</div>
        <h1>Gallery</h1>
        <p class="gallery-copy">A warm glimpse into music learning, performances, instruments, and classroom moments at Swaralaya School of Music.</p>
        <div class="gallery-grid">
          <figure><img src="/wordpress-media/2026__04__DSC_8147-scaled.jpeg" alt="Music Grade Certification" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2026__04__DSC_8240-683x1024.jpeg" alt="Swaralaya Moments" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2026__04__PHOTO-2026-03-15-15-51-29-1024x783.jpg" alt="Community Gathering" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2026__01__1-scaled.png" alt="Swarakshara Annual Day" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2026__01__2-scaled.png" alt="Annual Day Performance" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2026__01__3-scaled.png" alt="Annual Day Celebration" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2026__01__4-1-scaled.png" alt="Music Program" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2026__01__5-1024x681.png" alt="Stage Moment" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2026__01__swarlaya-scaled.png" alt="Swaralaya Annual Day" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2025__12__IMG_3480-scaled.jpeg" alt="Vande Mataram in Almere" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2025__12__sw-image-1024x473.png" alt="Vande Mataram Celebration" loading="lazy" /></figure>
          <figure><img src="/wordpress-media/2025__08__Swaralayaa.png" alt="Carnatic Music Learning" loading="lazy" /></figure>
        </div>
      </div>
    `;

    const footer = document.querySelector('footer');
    if (footer && footer.parentElement === main) {
      main.insertBefore(section, footer);
    } else {
      main.prepend(section);
    }
    cleanGalleryCards();
    ensureGalleryLightbox();
  }

  function applyRules() {
    if (!content) return;
    ensureMobileNavStyles();
    normalizeMobileCarousels();
    applyLogo(content.logoUrl);

    const header = document.querySelector('.header-area');
    const headerState = header && header.classList.contains('scrolled') ? 'scrolled' : 'top';
    const state = `${location.pathname}|${content.updatedAt || ''}|${document.body.innerText.length}|${headerState}`;
    if (state === lastApplied) return;
    lastApplied = state;

    (content.textRules || []).forEach((rule) => {
      if (!rule || !rule.enabled || !rule.selector) return;
      safeQuery(rule.selector).forEach((el) => {
        if (rule.match && !el.textContent.includes(rule.match)) return;
        el.textContent = rule.value || '';
      });
    });

    (content.htmlRules || []).forEach((rule) => {
      if (!rule || !rule.enabled || !rule.selector) return;
      safeQuery(rule.selector).forEach((el) => {
        if (rule.match && !el.textContent.includes(rule.match)) return;
        el.innerHTML = rule.value || '';
      });
    });

    (content.imageRules || []).forEach((rule) => {
      if (!rule || !rule.enabled || !rule.selector) return;
      safeQuery(rule.selector).forEach((el) => {
        if (rule.match && !`${el.getAttribute('src') || ''} ${el.getAttribute('alt') || ''}`.includes(rule.match)) return;
        if (rule.src) el.setAttribute('src', rule.src);
        if (rule.alt) el.setAttribute('alt', rule.alt);
        el.style.objectFit = rule.fit || 'cover';
      });
    });

    (content.linkRules || []).forEach((rule) => {
      if (!rule || !rule.enabled || !rule.selector) return;
      safeQuery(rule.selector).forEach((el) => {
        if (rule.match && !`${el.textContent || ''} ${el.getAttribute('href') || ''}`.includes(rule.match)) return;
        if (rule.href) el.setAttribute('href', rule.href);
        if (rule.label) el.textContent = rule.label;
      });
    });
  }

  function addAdminContentLink() {
    if (!isAdmin() || location.pathname === '/admin/content-manager') return;
    const nav = document.querySelector('aside nav');
    if (!nav || document.querySelector('[data-cms-link="content-manager"]')) return;

    const link = document.createElement('a');
    link.href = '/admin/content-manager';
    link.setAttribute('data-cms-link', 'content-manager');
    link.style.cssText = [
      'display:flex',
      'align-items:center',
      'gap:12px',
      'padding:12px 16px',
      'border-radius:8px',
      'color:#555',
      'text-decoration:none',
      'font-size:14.5px',
      'transition:all .2s',
      'font-weight:600',
    ].join(';');
    link.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Content Manager';
    nav.appendChild(link);
  }

  async function load() {
    try {
      ensureViewportMeta();
      markMobileDevice();
      ensureMobileNavStyles();
      normalizeMobileCarousels();
      ensureLogoContrastStyles();
      const response = await fetch(API, { cache: 'no-store' });
      if (!response.ok) {
        applyLogo(DEFAULT_LOGO_URL);
        fixMissingMarketingRoutes();
        addEventsNavLink();
        addGalleryNavLink();
        fixYouTubeEmbeds();
        normalizeNavActiveState();
        return;
      }
      content = await response.json();
      ensureLogoContrastStyles();
      fixMissingMarketingRoutes();
      cleanGalleryCards();
      applyRules();
      normalizeMobileCarousels();
      addEventsNavLink();
      addGalleryNavLink();
      fixYouTubeEmbeds();
      normalizeNavActiveState();
      addAdminContentLink();
    } catch (err) {
      console.warn('Swaralaya content manager could not load.', err);
    }
  }

  const observer = new MutationObserver(scheduleApply);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureViewportMeta();
      markMobileDevice();
      showHomeFirstLoadSplash();
      load();
      observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
    });
  } else {
    ensureViewportMeta();
    markMobileDevice();
    showHomeFirstLoadSplash();
    load();
    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
  }

  window.addEventListener('resize', markMobileDevice, { passive: true });
  window.addEventListener('resize', () => window.setTimeout(normalizeMobileCarousels, 80), { passive: true });
  window.visualViewport?.addEventListener('resize', () => {
    markMobileDevice();
    window.setTimeout(normalizeMobileCarousels, 80);
  }, { passive: true });
  window.addEventListener('popstate', () => setTimeout(load, 100));
  setInterval(() => {
      ensureViewportMeta();
      markMobileDevice();
      ensureMobileNavStyles();
      ensureLogoContrastStyles();
      applyLogo(content?.logoUrl || DEFAULT_LOGO_URL);
      fixMissingMarketingRoutes();
      applyRules();
      cleanGalleryCards();
      addEventsNavLink();
      addGalleryNavLink();
      fixYouTubeEmbeds();
      normalizeNavActiveState();
      addAdminContentLink();
  }, 1200);
})();
