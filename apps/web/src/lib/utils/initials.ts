/**
 * Initials for an avatar fallback.
 *
 * Deliberately conservative: it takes the first character of the first and last
 * whitespace-separated parts using a grapheme-aware split, so a name written in
 * a script without a Latin uppercase form is not mangled and an emoji-bearing
 * handle does not split mid-codepoint. Nothing is upper-cased, because many
 * scripts have no case at all.
 */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/u).filter(Boolean);
  if (parts.length === 0) {
    return '';
  }
  const first = firstGrapheme(parts[0] ?? '');
  if (parts.length === 1) {
    return first;
  }
  return `${first}${firstGrapheme(parts[parts.length - 1] ?? '')}`;
}

function firstGrapheme(value: string): string {
  return Array.from(value)[0] ?? '';
}
