import { isAxiosError } from "axios";

export function errorToString(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message + "";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Array) {
    return error.join(", ");
  }

  if (typeof error === "object") {
    return Object.values(error as any).join(", ");
  }

  return "Ocorreu um erro inesperado!";
}
