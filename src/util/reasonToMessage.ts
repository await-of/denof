export function reasonToMessage(reason: any): string {
  if (reason instanceof Error) {
    return reason.message;
  }
  if (typeof reason === "string") {
    return reason;
  }
  if (reason === undefined || reason === null) {
    return "Unknown Error";
  }
  return reason.toString();
}
