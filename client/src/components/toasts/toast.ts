import { ToastOptions, toast } from "react-toastify";

const toastDefaultConfig: ToastOptions = {
  hideProgressBar: true,
  draggable: false,
};

export const notify = {
  success: (message: string = "Sucesso!") => {
    toast.success(message, toastDefaultConfig);
  },

  error: (message: string = "Erro!") => {
    toast.error(message, toastDefaultConfig);
  },

  info: (message: string = "Info!") => {
    toast.info(message, toastDefaultConfig);
  },

  warning: (message: string = "Atenção!") => {
    toast.warn(message, toastDefaultConfig);
  },
};
