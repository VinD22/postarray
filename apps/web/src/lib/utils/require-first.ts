/**
 * The first element of a list that the caller believes cannot be empty.
 *
 * Used for fallbacks over fixed catalogues, where a non-null assertion would
 * silently produce `undefined` the day the catalogue is emptied. This throws
 * with the name of the list instead, which is the difference between a clear
 * failure and a downstream `cannot read property of undefined`.
 */
export function requireFirst<T>(list: readonly T[], what: string): T {
  const first = list[0];
  if (first === undefined) {
    throw new Error(`expected at least one ${what}`);
  }
  return first;
}
