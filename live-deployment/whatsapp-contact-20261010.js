(() => {
  const whatsappUrl = 'https://wa.me/31642825268';
  const numberPattern = /\+31\s*6?\s*428\s*25268/g;

  function updateWhatsappContact() {
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach((link) => {
      link.href = whatsappUrl;
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName)) {
        node.nodeValue = node.nodeValue.replace(numberPattern, '+31 6 42825268');
      }
    }
  }

  new MutationObserver(updateWhatsappContact).observe(document.documentElement, { childList: true, subtree: true });
  updateWhatsappContact();
})();
