(function () {
  const header = document.querySelector('.site-header');
  const navLinks = Array.from(document.querySelectorAll('.nav a'));

  function sectionIdForLink(link) {
    const href = link.getAttribute('href') || '';
    if (href === '/' || href === './' || href === 'index.html') return 'about';
    if (href.startsWith('#')) return href.slice(1);
    return null;
  }

  const sections = navLinks
    .map((link) => {
      const id = sectionIdForLink(link);
      if (!id) return null;
      const el = document.getElementById(id);
      return el ? { id, el, link } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  function stripAboutHash() {
    if (location.hash !== '#about') return;
    const path = location.pathname || '/';
    const url = path + (location.search || '');
    history.replaceState(null, '', url);
  }

  stripAboutHash();
  window.addEventListener('hashchange', stripAboutHash);

  function setActive(id) {
    navLinks.forEach((link) => {
      if (sectionIdForLink(link) === id) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function updateActiveSection() {
    const offset = (header?.offsetHeight ?? 52) + 12;
    let active = sections[0].id;

    for (const { id, el } of sections) {
      const top = el.getBoundingClientRect().top;
      if (top - offset <= 0) active = id;
    }

    setActive(active);
    if (active === 'about') stripAboutHash();
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection);
  updateActiveSection();
})();
