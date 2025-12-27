import React from "react";

export default function Modal({ open, title, onClose, children, width = 900 }) {
  React.useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal open" onMouseDown={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h3>{title}</h3>
          <div className="close-modal" onClick={onClose}>
            <i className="fas fa-times" />
          </div>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
