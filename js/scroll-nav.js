(function () {
  const header = document.querySelector('.site-header');
  const navLinks = Array.from(document.querySelectorAll('.nav a'));

  function sectionIdForLink(link) {
    const href = link.getAttribute('href') || '';
    if (href === '/' || href === './' || href === 'index.html' || href === '#about') return 'about';
    if (href.startsWith('#')) return href.slice(1);
    return null;
  }

  function isAboutHomeLink(link) {
    const href = link.getAttribute('href') || '';
    return href === '/' || href === './' || href === 'index.html' || href === '#about';
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

  let scrollSpyLocked = false;
  let unlockScrollSpy = null;

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
    if (scrollSpyLocked) return;

    const offset = (header?.offsetHeight ?? 52) + 12;
    let active = sections[0].id;

    for (const { id, el } of sections) {
      const top = el.getBoundingClientRect().top;
      if (top - offset <= 0) active = id;
    }

    setActive(active);
    if (active === 'about') stripAboutHash();
  }

  function lockScrollSpyForSmoothScroll(targetId) {
    if (unlockScrollSpy) unlockScrollSpy();

    scrollSpyLocked = true;
    setActive(targetId);

    let done = false;
    let timeoutId = 0;

    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timeoutId);
      scrollSpyLocked = false;
      unlockScrollSpy = null;
      window.removeEventListener('scroll', onScroll);
      updateActiveSection();
    };

    const onScroll = () => {
      if (window.scrollY > 2) return;
      finish();
    };

    unlockScrollSpy = finish;
    window.addEventListener('scroll', onScroll, { passive: true });
    timeoutId = window.setTimeout(finish, 2000);
  }

  function scrollToAbout(e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const rootUrl = (location.pathname || '/') + (location.search || '');
    history.replaceState(null, '', rootUrl);

    if (window.scrollY <= 2) {
      setActive('about');
      return;
    }

    lockScrollSpyForSmoothScroll('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.filter(isAboutHomeLink).forEach((link) => {
    link.addEventListener('click', scrollToAbout);
  });

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection);
  updateActiveSection();
})();
