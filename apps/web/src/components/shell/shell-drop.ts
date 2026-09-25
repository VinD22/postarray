/**
 * Pure rules for the app-shell drop target, kept apart so they are testable.
 */

/** Screens with their own drop zone, where a shell drop would compete. */
const OWN_DROP_ZONE = ['/compose', '/library'];

export function shellDropEnabled(pathname: string): boolean {
  return !OWN_DROP_ZONE.some(
    (route) => pathname === route || pathname.endsWith(route) || pathname.includes(`${route}/`),
  );
}

/** A drag carrying files, as opposed to text or a link dragged inside the page. */
export function isFileDrag(transfer: DataTransfer | null): boolean {
  return transfer !== null && Array.from(transfer.types).includes('Files');
}

/** At most this many files start one post; the composer takes more from the library. */
export const SHELL_DROP_MAX_FILES = 10;

export function droppableMedia(files: readonly File[]): File[] {
  return files
    .filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))
    .slice(0, SHELL_DROP_MAX_FILES);
}
