(() => {
  const id = 'swarakshara-2026-home-banner';
  const expiresAt = new Date('2026-11-02T00:00:00+01:00').getTime();
  const ticketUrl = 'https://kunstlinie.nl/programma/swarakshara-2026/?_gl=1*1iyurmy*_up*MQ..*_ga*MTQ0NTIwOTA5My4xNzkxNTQzMDcy*_ga_67WFPKHE6Q*czE3OTE1NDMwNzIkbzEkZzEkdDE3OTE1NDMwNzQkajU4JGwwJGgw';

  const isHome = () => location.pathname === '/' || location.pathname === '';
  const remove = () => document.getElementById(id)?.remove();

  function render() {
    if (!isHome() || Date.now() >= expiresAt) return remove();
    if (document.getElementById(id)) return true;

    const heading = [...document.querySelectorAll('h1, h2, h3')]
      .find(element => /Indian Carnatic music classes to help you discover the melody within/i.test(element.textContent || ''));
    const anchor = heading?.closest('section') || heading?.parentElement;
    if (!anchor) return false;

    const section = document.createElement('section');
    section.id = id;
    section.innerHTML = `
      <div class="swarakshara-2026-inner">
        <div class="swarakshara-2026-copy">
          <p class="swarakshara-2026-kicker">Swarakshara 2026</p>
          <h2>Celebrate Music, Culture &amp; Community</h2>
          <p>Swarakshara is Swaralaya School of Music’s annual celebration, bringing together our students, families and music community for a day of performances. Around 320 students will take the stage this year, accompanied by live artists.</p>
          <ul>
            <li><strong>Date:</strong> Sunday, 1 November 2026</li>
            <li><strong>Venue:</strong> Kunstlinie, Almere</li>
            <li><strong>Time:</strong> 10:00 AM onwards</li>
          </ul>
          <a class="swarakshara-2026-button" href="${ticketUrl}" target="_blank" rel="noopener noreferrer">Book tickets <span aria-hidden="true">↗</span></a>
        </div>
      </div>`;

    const style = document.createElement('style');
    style.textContent = `
      #${id}{padding:72px 20px;background:linear-gradient(135deg,#f9f4ee,#fff 55%,#f3e3d2)}
      #${id} .swarakshara-2026-inner{width:min(1120px,100%);margin:0 auto;padding:48px 56px;border-radius:20px;background:#713426;color:#fff;box-shadow:0 18px 46px rgba(71,32,22,.2)}
      #${id} .swarakshara-2026-copy{max-width:800px}
      #${id} .swarakshara-2026-kicker{margin:0 0 10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#f5c86b;font-size:.82rem}
      #${id} h2{margin:0 0 18px;color:#fff;font-family:Georgia,'Times New Roman',serif;font-size:clamp(2rem,4vw,3.25rem);line-height:1.1}
      #${id} p{margin:0 0 20px;font-size:1.05rem;line-height:1.75}
      #${id} ul{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 0 28px;padding:0;list-style:none}
      #${id} li{padding:12px 14px;border-left:3px solid #f5c86b;background:rgba(255,255,255,.1)}
      #${id} .swarakshara-2026-button{display:inline-flex;align-items:center;gap:10px;padding:14px 22px;border-radius:8px;background:#f5c86b;color:#4b2117;text-decoration:none;font-weight:800;transition:transform .2s ease,background .2s ease}
      #${id} .swarakshara-2026-button:hover{background:#fff;transform:translateY(-2px)}
      @media(max-width:700px){#${id}{padding:48px 16px}#${id} .swarakshara-2026-inner{padding:32px 24px}#${id} ul{grid-template-columns:1fr}}
    `;
    section.prepend(style);
    anchor.insertAdjacentElement('afterend', section);
    return true;
  }

  const observer = new MutationObserver(() => { if (render()) observer.disconnect(); });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  render();
  window.addEventListener('popstate', render);
})();
