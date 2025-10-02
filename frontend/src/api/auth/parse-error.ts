
export const parseError=(error: unknown, defaultMessage: string): string=> {
    let errorMessage = defaultMessage;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const err = error as {
      response?: { data?: { message?: string | string[] } };
    };
    const msg = err.response?.data?.message;
    if (msg) errorMessage = Array.isArray(msg) ? msg[0] : msg;
  }

  return errorMessage;
}