/** Accept a same-origin path from an untrusted query parameter. */
export function safeReturnPath(value: string | null, fallback = '/home'): string {
  if (
    value === null ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    [...value].some((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint <= 31 || codePoint === 127;
    })
  ) {
    return fallback;
  }

  return value;
}
