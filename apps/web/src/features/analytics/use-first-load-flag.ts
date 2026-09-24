import { useEffect, useRef } from 'react';

/**
 * True on every render up to and including the first commit in which `ready`
 * is true, false on every render after it.
 *
 * The ref is only written in an effect, after that commit. Writing it during
 * render made the second of React's double renders disagree with the first
 * (and a hydrating client disagree with the server), so the same row was
 * server rendered as a count-up and hydrated as plain text.
 */
export function useFirstLoadFlag(ready: boolean): boolean {
  const doneRef = useRef(false);
  useEffect(() => {
    if (ready) doneRef.current = true;
  }, [ready]);
  return ready && !doneRef.current;
}
