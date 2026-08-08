import { load } from 'cheerio';

const SLUGS = [
    'carnatic-music-made-simple-5-basic-terms-every-beginner-in-carnatic-music-should-know',
  ];
  
  async function extractPost(slug) {
    const res = await fetch(`https://www.swaralayaschoolofmusic.nl/wp-json/wp/v2/posts?slug=${slug}`);
    const data = await res.json();
    if (!data.length) {
      console.log(`No post found for slug: ${slug}`);
      return;
    }
    const post = data[0];
    const $ = load(post.content.rendered);
    let clean = '';
  
    $('.elementor-widget').each((_, widget) => {
      const type = $(widget).attr('data-widget-type') || $(widget).attr('data-widget_type') || '';
  
      if (type.includes('title')) {
        $(widget).find('h1, h2, h3, h4').each((_, h) => {
          const text = $(h).text().trim();
          if (text) clean += `<h3>${text}</h3>\n\n`;
        });
      } else if (type.includes('text-editor')) {
        $(widget).find('p').each((_, p) => {
          const text = $(p).html()?.trim();
          if (text) clean += `<p>${text}</p>\n\n`;
        });
      } else if (type.includes('icon-list')) {
        clean += '<ul>\n';
        $(widget).find('.elementor-icon-list-item').each((_, li) => {
          const text = $(li).find('.elementor-icon-list-text').html()?.trim();
          if (text) clean += `  <li>${text}</li>\n`;
        });
        clean += '</ul>\n\n';
      }
    });
  
    console.log(`\n===== ${post.title.rendered} (${slug}) =====\n`);
    console.log(clean);
  }
  
  for (const slug of SLUGS) {
    await extractPost(slug);
  }
