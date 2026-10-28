import { X } from "lucide-react";
import { type CSSProperties, useRef, useState } from "react";

type ZoomableImageProps = {
  alt: string;
  height: number;
  src: string;
  width: number;
};

const zoomEasing = "cubic-bezier(0.2, 0, 0, 1)";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ZoomableImage({ alt, height, src, width }: ZoomableImageProps) {
  const thumbnailRef = useRef<HTMLImageElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const zoomedRef = useRef<HTMLImageElement>(null);
  const isClosing = useRef(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Transform that places the zoomed image exactly over the thumbnail.
  const getThumbnailTransform = () => {
    const from = thumbnailRef.current!.getBoundingClientRect();
    const to = zoomedRef.current!.getBoundingClientRect();

    return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${
      from.width / to.width
    })`;
  };

  const open = () => {
    const dialog = dialogRef.current;
    const backdrop = backdropRef.current;
    const zoomed = zoomedRef.current;
    if (!dialog || !backdrop || !zoomed || dialog.open) return;

    dialog.showModal();
    dialog.scrollTo(0, 0);
    setIsZoomed(true);
    // Clear the fade-out left over from the last close.
    backdrop.getAnimations().forEach((animation) => animation.cancel());
    if (prefersReducedMotion()) return;

    zoomed.animate(
      [{ transform: getThumbnailTransform() }, { transform: "none" }],
      { duration: 260, easing: zoomEasing },
    );
    backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
  };

  const close = () => {
    const dialog = dialogRef.current;
    const backdrop = backdropRef.current;
    const zoomed = zoomedRef.current;
    if (!dialog?.open || !backdrop || !zoomed || isClosing.current) return;

    const finish = () => {
      isClosing.current = false;
      dialog.close();
      setIsZoomed(false);
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    isClosing.current = true;
    zoomed.getAnimations().forEach((animation) => animation.cancel());
    backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 200,
      fill: "forwards",
    });
    // Close even if the animation is cancelled, so the dialog can't get stuck.
    zoomed
      .animate([{ transform: "none" }, { transform: getThumbnailTransform() }], {
        duration: 200,
        easing: zoomEasing,
      })
      .finished.then(finish, finish);
  };

  return (
    <>
      <button
        aria-label={`Enlarge image: ${alt}`}
        className="zoomable-thumbnail"
        onClick={open}
        type="button"
      >
        <img
          alt={alt}
          className={isZoomed ? "invisible w-full" : "w-full"}
          height={height}
          ref={thumbnailRef}
          src={src}
          width={width}
        />
      </button>

      <dialog
        aria-label="Enlarged image"
        className="lightbox"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        ref={dialogRef}
      >
        <div className="lightbox-backdrop" onClick={close} ref={backdropRef} />
        <img
          alt={alt}
          className="lightbox-image"
          height={height}
          ref={zoomedRef}
          src={src}
          style={{ "--lightbox-aspect": width / height } as CSSProperties}
          width={width}
        />
        <button
          aria-label="Close"
          className="lightbox-close"
          onClick={close}
          type="button"
        >
          <X aria-hidden="true" size={20} strokeWidth={1.75} />
        </button>
      </dialog>
    </>
  );
}
