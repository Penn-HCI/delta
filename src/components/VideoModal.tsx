import { X } from "lucide-react";
import { useEffect, useRef } from "react";

// A video in a modal over the page. The video element exists only while the
// modal is open, so nothing downloads until a reader asks for it, and it
// starts playing as it opens.
export function VideoModal({
  isOpen,
  onClose,
  src,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  title: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      aria-label={title}
      className="lightbox video-modal"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      ref={dialogRef}
    >
      <div className="lightbox-backdrop" onClick={onClose} />
      {isOpen && (
        <video
          autoPlay
          className="video-modal-player"
          controls
          playsInline
          src={src}
        >
          <a href={src}>Download the video</a>
        </video>
      )}
      <button
        aria-label="Close video"
        className="lightbox-close"
        onClick={onClose}
        type="button"
      >
        <X aria-hidden="true" size={20} strokeWidth={1.75} />
      </button>
    </dialog>
  );
}
