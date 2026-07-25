import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef =
    useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const modalElement = modalRef.current;

      if (!modalElement) {
        return;
      }

      const focusableElements =
        modalElement.querySelectorAll<HTMLElement>(
          `
          button:not([disabled]),
          input:not([disabled]),
          select:not([disabled]),
          textarea:not([disabled]),
          a[href],
          [tabindex]:not([tabindex="-1"])
        `
        );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      }

      if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
    
    cancelButtonRef.current?.focus();

    return () => {
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div ref={modalRef} className="confirm-modal" role="dialog" aria-modal="true"
        aria-labelledby="confirm-modal-title" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close-button" onClick={onCancel} aria-label="Close confirmation modal">
          <X size={20} />
        </button>

        <div className="confirm-modal-icon">
          <AlertTriangle size={24} />
        </div>

        <h2 id="confirm-modal-title">{title}</h2>
        <p>{message}</p>

        <div className="confirm-modal-actions">
          <button ref={cancelButtonRef} type="button" className="secondary-button" onClick={onCancel}>
            {cancelText}
          </button>

          <button type="button" className="danger-button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
