import React from "react";

interface ModalProps {
  children: React.ReactNode;
  confirmAction: () => void;
  cancelText: string;
  confirmText: string;
  id: string;
}

export default function Content({
  children,
  confirmAction,
  cancelText,
  confirmText,
  id,
}: ModalProps) {
  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg">{children}</h3>
          <div className="modal-action">
            <label htmlFor={id} className="btn btn-warning">
              {cancelText}
            </label>
            <button className="btn btn-info" onClick={confirmAction}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
