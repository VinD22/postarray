/** Accept a same-origin path from an untrusted query parameter. */
export function safeReturnPath(value: string | null, fallback = '/home'): string {
  if (
    value === null ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /[\u0000-\u001f\u007f]/u.test(value)
  ) {
    return fallback;
  }

  return value;
}
