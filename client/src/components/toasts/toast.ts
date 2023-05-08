import { toast } from "react-toastify";
import { toastDefaultConfig } from "./default-config";

export function notifySuccess(message: string = "Sucesso!") {
  toast.success(message, toastDefaultConfig);
}

export function notifyError(message: string = "Erro!") {
  toast.error(message, toastDefaultConfig);
}

export function notifyInfo(message: string = "Info!") {
  toast.info(message, toastDefaultConfig);
}

export function notifyWarning(message: string = "Atenção!") {
  toast.warn(message, toastDefaultConfig);
}
