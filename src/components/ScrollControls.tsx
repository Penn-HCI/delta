import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Code boxes don't scroll with the mouse wheel, so the wheel always scrolls
// the page. These buttons scroll a box whose code is taller than it is, and
// show only when it is.
export function ScrollControls({
  label,
  target,
}: {
  label: string;
  target: RefObject<HTMLElement>;
}) {
  const [position, setPosition] = useState({
    overflows: false,
    atTop: true,
    atBottom: true,
  });

  useEffect(() => {
    const scroller = target.current;
    if (!scroller) return;

    const update = () => {
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      setPosition({
        overflows: maxScroll > 1,
        atTop: scroller.scrollTop <= 1,
        atBottom: scroller.scrollTop >= maxScroll - 1,
      });
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    // The box resizes with the window, and its code grows as readers edit it.
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    for (const child of scroller.children) observer.observe(child);
    return () => {
      scroller.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [target]);

  if (!position.overflows) return null;

  const scrollByPage = (direction: 1 | -1) => {
    const scroller = target.current;
    if (!scroller) return;
    scroller.scrollBy({
      top: direction * scroller.clientHeight * 0.75,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <div className="code-scroll-controls">
      <button
        aria-label={`Scroll ${label} up`}
        className="code-icon-button"
        disabled={position.atTop}
        onClick={() => scrollByPage(-1)}
        title="Scroll up"
        type="button"
      >
        <ChevronUp aria-hidden="true" size={14} strokeWidth={1.9} />
      </button>
      <button
        aria-label={`Scroll ${label} down`}
        className="code-icon-button"
        disabled={position.atBottom}
        onClick={() => scrollByPage(1)}
        title="Scroll down"
        type="button"
      >
        <ChevronDown aria-hidden="true" size={14} strokeWidth={1.9} />
      </button>
    </div>
  );
}
