(() => {
  const media = '/wordpress-media/courses/';
  const maps = {
    '/courses': {
      Vocals: 'vocals-course.jpg',
      Instruments: 'instruments-course.png',
    },
    '/vocals': {
      'Carnatic Vocal training at Swaralaya': 'vocals-hero.jpg',
      'Indian Carnatic Music': 'vocals-carnatic.png',
      'Vocalist at Swaralaya': 'vocals-musician.jpg',
    },
    '/instruments': {
      'Carnatic instrumental music at Swaralaya': 'instruments-hero.jpg',
      Harmonium: 'harmonium.jpg',
      'Musician at Swaralaya': 'instruments-musician.jpg',
    },
  };
  const tabImages = {
    '/vocals': {
      'Indian Carnatic Music': 'vocals-carnatic.png',
      'Light Music': 'vocals-light.png',
      'Cinematic Singing': 'vocals-cinematic.png',
      'Devotional Songs': 'vocals-devotional.png',
    },
    '/instruments': {
      Harmonium: 'harmonium.jpg',
      Piano: 'piano.png',
      Dholak: 'dholak.png',
    },
  };
  const safeAlt = {
    'Carnatic Vocal training at Swaralaya': 'Vocal course hero',
    'Vocalist at Swaralaya': 'Vocal course musician',
    'Carnatic instrumental music at Swaralaya': 'Instrument course hero',
    'Musician at Swaralaya': 'Instrument course musician',
  };
  const setImage = (alt, filename) => {
    document.querySelectorAll(`img[alt="${alt}"], img[alt="${safeAlt[alt] || alt}"]`).forEach(image => {
      if (safeAlt[alt]) image.alt = safeAlt[alt];
      image.src = media + filename;
    });
  };
  const apply = () => {
    Object.entries(maps[location.pathname] || {}).forEach(([alt, filename]) => setImage(alt, filename));
    const photo = document.querySelector('img[alt="Instrument course musician"], img[alt="Vocal course musician"]');
    const decoration = photo?.previousElementSibling;
    if (decoration?.tagName === 'IMG' && !decoration.alt) decoration.src = media + 'graphics.png';
  };
  document.addEventListener('click', event => {
    const label = event.target.closest('button')?.textContent.trim();
    const filename = tabImages[location.pathname]?.[label];
    if (!filename) return;
    window.setTimeout(() => {
      const image = document.querySelector('.tab-image-col img');
      if (image) image.src = media + filename;
    }, 0);
  });
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });
  apply();
})();
