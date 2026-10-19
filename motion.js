(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.motion-toggle');
  if (toggle && !reduced.matches) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const paused = document.documentElement.classList.toggle('motion-paused');
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Bewegung fortsetzen' : 'Bewegung pausieren';
    });
    reduced.addEventListener('change', event => { toggle.hidden = event.matches; });
  }
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.services > h2, .service-deck, .service-consult, .video-heading, .video-grid, .about > div, #ablauf > h2, .steps, .faq > h2, .contact > div');
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting) continue;
      target.classList.remove('is-waiting');
      target.classList.add('is-visible');
      observer.unobserve(target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(target => {
    target.classList.add('scroll-reveal');
    if (target.getBoundingClientRect().top > window.innerHeight) {
      target.classList.add('is-waiting');
      observer.observe(target);
    }
  });
  const showAll = () => {
    observer.disconnect();
    targets.forEach(target => target.classList.remove('is-waiting'));
  };
  reduced.addEventListener('change', event => { if (event.matches) showAll(); });
  // Anchor navigation and keyboard focus should never land on hidden content.
  document.addEventListener('focusin', showAll, { once: true });
  window.addEventListener('hashchange', showAll, { once: true });
})();
