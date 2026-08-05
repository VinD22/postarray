/**
 * One value per line.
 *
 * Lists of claims, blocked terms, markets and domains are edited as text
 * because that is how people paste them out of a document. The conversion is
 * kept in one place so an empty line never becomes an empty rule.
 */

export function toLines(values: readonly string[]): string {
  return values.join('\n');
}

export function fromLines(value: string): readonly string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
