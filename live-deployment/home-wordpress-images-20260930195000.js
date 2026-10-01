(() => {
  const images = {
    'Founder Vandana Ramakrishnan performing on stage': '/wordpress-media/home/founder-home.jpeg',
    'Vocals Course': '/wordpress-media/home/WhatsApp-Image-2025-06-14-at-20.17.09_5a0fdda7-1024x583.jpg',
    'Instruments Course': '/wordpress-media/home/Untitled-design-4-1024x583.png',
  };

  const apply = () => {
    if (location.pathname !== '/' && location.pathname !== '') return;
    Object.entries(images).forEach(([alt, src]) => {
      document.querySelectorAll(`img[alt="${alt}"]`).forEach(image => {
        if (alt.startsWith('Founder')) image.alt = 'Founder portrait';
        if (image.getAttribute('src') !== src) image.src = src;
      });
    });
    document.querySelectorAll('img[alt="Founder portrait"]').forEach(image => {
      if (image.getAttribute('src') !== images['Founder Vandana Ramakrishnan performing on stage']) image.src = images['Founder Vandana Ramakrishnan performing on stage'];
    });
    const videoHeading = [...document.querySelectorAll('h2')].find(heading => heading.textContent.includes('See the Magic'));
    const videoSection = videoHeading?.closest('section');
    if (videoSection) videoSection.classList.add('wordpress-home-videos');
  };

  const style = document.createElement('style');
  style.textContent = '.wordpress-home-videos{background-image:linear-gradient(rgba(255,255,255,.9),rgba(255,255,255,.9)),url("/wordpress-media/home/sheet-music-8464000_1280.jpg")!important;background-size:cover!important;background-position:center!important}.wordpress-home-videos img[alt="Vocals Course"],.wordpress-home-videos img[alt="Instruments Course"]{object-fit:cover}';
  document.head.append(style);
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });
  apply();
})();
