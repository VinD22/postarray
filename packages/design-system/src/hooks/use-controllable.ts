import { useCallback, useRef, useState } from 'react';

export interface UseControllableOptions<T> {
  /** The controlled value. When defined, the component is controlled. */
  value?: T | undefined;
  /** The starting value when uncontrolled. */
  defaultValue: T;
  /** Called on every change, controlled or not. */
  onChange?: ((next: T) => void) | undefined;
}

/**
 * One state hook that works for both controlled and uncontrolled components,
 * so a primitive never has to be written twice. The mode is locked on first
 * render: switching a component between controlled and uncontrolled mid-life
 * silently loses state, so we keep the first decision.
 */
export function useControllable<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableOptions<T>): [T, (next: T | ((current: T) => T)) => void] {
  const isControlled = useRef(value !== undefined).current;
  const [internal, setInternal] = useState<T>(defaultValue);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const resolved = isControlled && value !== undefined ? value : internal;
  const resolvedRef = useRef(resolved);
  resolvedRef.current = resolved;

  const setValue = useCallback(
    (next: T | ((current: T) => T)) => {
      const computed =
        typeof next === 'function'
          ? (next as (current: T) => T)(resolvedRef.current)
          : next;
      if (Object.is(computed, resolvedRef.current)) return;
      if (!isControlled) setInternal(computed);
      onChangeRef.current?.(computed);
    },
    [isControlled],
  );

  return [resolved, setValue];
}
