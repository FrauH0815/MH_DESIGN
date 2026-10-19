(() => {
  const number = document.querySelector('.experience strong');
  if (number && 'IntersectionObserver' in window) {
    const target = Number(number.textContent);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const finish = () => {
      cancelAnimationFrame(frame);
      number.textContent = String(target);
    };
    if (Number.isFinite(target) && !reduced.matches) {
      // Keep the complete value available to screen readers throughout the animation.
      number.setAttribute('aria-label', String(target));
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        if (reduced.matches) { finish(); return; }
        let started;
        const tick = now => {
          started ??= now;
          const progress = Math.min((now - started) / 1600, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          number.textContent = String(Math.floor(target * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
          else finish();
        };
        frame = requestAnimationFrame(tick);
      }, { threshold: .7 });
      observer.observe(number);
      reduced.addEventListener('change', event => {
        if (event.matches) { observer.disconnect(); finish(); }
      });
    }
  }
  const deck = document.querySelector('.service-deck');
  if (deck) {
    const summaries = [...deck.querySelectorAll('.service-tile > summary')];
    let lastWidth = 0;
    const alignCards = () => {
      deck.style.removeProperty('--service-summary-height');
      const height = Math.ceil(Math.max(...summaries.map(item => item.getBoundingClientRect().height)));
      deck.style.setProperty('--service-summary-height', `${height}px`);
    };
    alignCards();
    if ('ResizeObserver' in window) {
      new ResizeObserver(entries => {
        const width = entries[0].contentRect.width;
        if (Math.abs(width - lastWidth) < 1) return;
        lastWidth = width;
        alignCards();
      }).observe(deck);
    } else window.addEventListener('resize', alignCards);
    document.fonts?.ready.then(alignCards);
  }
  const links = [...document.querySelectorAll('.nav a[href^="#"]')].filter(link => link.getAttribute('href') !== '#start');
  if (!('IntersectionObserver' in window)) return;
  const positions = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => positions.set(entry.target.id, entry.isIntersecting));
    const current = links.find(link => positions.get(link.hash.slice(1)));
    links.forEach(link => {
      if (link === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  links.forEach(link => { const section = document.getElementById(link.hash.slice(1)); if (section) observer.observe(section); });
})();
