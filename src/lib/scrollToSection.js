// Used by both the top nav and the mobile tab bar instead of a plain
// `<a href="#id">` jump. A bare anchor click works fine on its own, but this
// page also has CSS scroll-snap on the scroll container — if a snap point
// sits between where you are and where you're going, the browser's native
// smooth-scroll can catch on it and hold there, which reads as the page
// starting to navigate to the tapped section and then springing back to the
// one you were just on. Suspending snap for the duration of the scroll (see
// `html.snap-suspended` in index.css) removes that fight entirely.
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const root = document.documentElement;
  root.classList.add('snap-suspended');

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    root.classList.remove('snap-suspended');
    window.removeEventListener('scrollend', finish);
    clearTimeout(fallback);
  };

  // `scrollend` isn't supported in every browser yet, so a timeout is the
  // real guarantee here — long enough to cover a full-page smooth scroll,
  // short enough that a stray failure to fire doesn't leave snap off for
  // the rest of the visit.
  const fallback = setTimeout(finish, 900);
  window.addEventListener('scrollend', finish, { once: true });

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Keeps the URL/back-button in sync without the browser's own jump-to-hash
  // behaviour, which would fight the smooth scroll above.
  window.history.replaceState(null, '', `#${id}`);
}
