/**
 * Run a scroll handler only while a target is near the viewport.
 * Pins used to listen for the whole page, so every section paid for the others.
 */
export function listenWhileNear(
  targets: Array<Element | null | undefined>,
  onScroll: () => void,
  rootMargin = "120% 0px 80% 0px",
) {
  const visible = new Set<Element>();
  let listening = false;

  const setListening = (next: boolean) => {
    if (next === listening) return;
    listening = next;
    if (next) window.addEventListener("scroll", onScroll, { passive: true });
    else window.removeEventListener("scroll", onScroll);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setListening(visible.size > 0);
      onScroll();
    },
    { rootMargin },
  );

  for (const target of targets) {
    if (target) observer.observe(target);
  }

  return () => {
    observer.disconnect();
    setListening(false);
  };
}
