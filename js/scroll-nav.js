(function () {
  const header = document.querySelector('.site-header');
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      return el ? { id, el, link } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  function setActive(id) {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === '#' + id) {
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
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection);
  updateActiveSection();
})();
