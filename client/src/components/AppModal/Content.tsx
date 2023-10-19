import React from "react";

interface ModalProps {
  children: React.ReactNode;
  confirmAction?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  cancelText?: string;
  confirmText?: string;
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
      <div className="modal modal-bottom sm:modal-middle w-full">
        <div className="modal-box">
          <h3 className="text-lg">{children}</h3>
          <div className="modal-action">
            {confirmText && (
              <button className="btn btn-success" onClick={confirmAction}>
                {confirmText}
              </button>
            )}
            <label htmlFor={id} className="btn btn-error">
              {cancelText ? cancelText : "Fechar"}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
