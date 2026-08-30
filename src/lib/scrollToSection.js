// Used by both the top nav and the mobile tab bar instead of a plain
// `<a href="#id">` jump, for one reason: it keeps the URL and the back button
// in sync without the browser's own jump-to-hash, which would fight the smooth
// scroll.
//
// This used to be considerably more than that. The page had CSS scroll-snap on
// the root, and a snap point sitting between here and the destination could
// catch the native smooth scroll and hold it there — the page read as starting
// to navigate and then springing back. Working around it took a class that
// suspended snap for the duration, a `scrollend` listener, and a 900ms timer to
// re-enable snap if `scrollend` never fired. The snap is gone, so all of that
// is gone with it.
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${id}`);
}
