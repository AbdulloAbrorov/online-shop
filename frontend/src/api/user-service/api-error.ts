import { AxiosError } from "axios";

export const handleApiError = (error: unknown, defaultMessage: string): never => {
  let errorMessage = defaultMessage;

  if (error instanceof AxiosError) {
    const msg = error.response?.data?.message;
    if (msg) errorMessage = Array.isArray(msg) ? msg[0] : msg;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  throw new Error(errorMessage);
};