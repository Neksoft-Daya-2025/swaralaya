(() => {
  let loading = false;
  let renderedPath = '';
  const validUrl = value => typeof value === 'string' && value.trim() !== '' && !/^(?:YOUR_IMAGE_URL|data:|javascript:)/i.test(value.trim());

  const renderGallery = async () => {
    const path = location.pathname;
    if (!path.startsWith('/blogs/')) return;
    document.querySelectorAll('.wp-article-image-gallery').forEach(node => node.remove());
    if (loading || renderedPath === path) return;
    const article = document.querySelector('.blog-detail-article');
    if (!article) return;
    loading = true;
    try {
      const response = await fetch('/api/blogs');
      const posts = response.ok ? await response.json() : [];
      const slug = path.split('/').filter(Boolean).pop();
      const post = posts.find(item => item.slug === slug);
      if (!post) return;

      const images = [...new Set((Array.isArray(post.galleryImages) ? post.galleryImages : []).filter(validUrl))];
      article.querySelectorAll('.blog-admin-image-gallery').forEach(node => node.remove());
      if (!images.length) return;

      const gallery = document.createElement('section');
      gallery.className = 'blog-admin-image-gallery';
      const heading = document.createElement('h2');
      heading.textContent = 'Photo Gallery';
      const grid = document.createElement('div');
      grid.className = 'blog-admin-image-grid';
      images.forEach(url => {
        const image = document.createElement('img');
        image.src = url;
        image.alt = 'Blog gallery image';
        grid.append(image);
      });
      gallery.append(heading, grid);
      article.append(gallery);
      renderedPath = path;
    } finally {
      loading = false;
    }
  };

  const style = document.createElement('style');
  style.textContent = '.wp-article-image-gallery{display:none!important}.blog-detail-article .elementor-icon-list-icon{display:none!important}.blog-detail-article svg.e-font-icon-svg{width:1rem!important;height:1rem!important;display:inline-block}.blog-admin-image-gallery{margin:3rem 0 0;padding-top:2rem;border-top:1px solid #e7ddd5}.blog-admin-image-gallery h2{margin:0 0 1.25rem;color:#5d281c;font-size:1.7rem}.blog-admin-image-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.blog-admin-image-grid img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;border-radius:12px;background:#f5f1ed}@media(max-width:700px){.blog-admin-image-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}}';
  document.head.append(style);
  new MutationObserver(() => { if (renderedPath !== location.pathname) renderGallery(); }).observe(document.documentElement, { childList: true, subtree: true });
  renderGallery();
})();
