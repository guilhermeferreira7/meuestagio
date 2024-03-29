interface ModalProps {
  children: React.ReactNode;
  confirmAction?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  cancelText?: string;
  confirmText?: string;
  buttonType?: "success" | "error";
  id: string;
}

export default function Content({
  children,
  confirmAction,
  cancelText,
  confirmText,
  buttonType,
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
              <button
                className={`btn btn-${buttonType ?? "success"}`}
                onClick={confirmAction}
              >
                {confirmText}
              </button>
            )}
            <label
              htmlFor={id}
              className="flex items-center p-1 hover:cursor-pointer border border-error text-error rounded-md"
            >
              {cancelText ? cancelText : "Fechar"}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
