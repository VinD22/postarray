'use client';

/**
 * The row of platform action glyphs under a post.
 *
 * Entirely decorative and entirely inert: no counts, no numbers, nothing that
 * could be read as engagement the post has not had. It exists so the mock post
 * reads as a post rather than as a paragraph in a box, which is why it is
 * hidden from assistive technology instead of being given labels for controls
 * that do nothing.
 */

import type { ComponentType, ReactNode } from 'react';

/** Lucide icons carry a `displayName`, which is what keys the row. */
type ActionIcon = ComponentType<{ className?: string }> & { readonly displayName?: string };

export interface PreviewActionsProps {
  readonly icons: readonly ActionIcon[];
  readonly className?: string;
}

export function PreviewActions({ icons, className }: PreviewActionsProps): ReactNode {
  return (
    <div
      aria-hidden
      className={`text-text-tertiary flex items-center gap-6 pt-1 ${className ?? ''}`}
    >
      {icons.map((Icon) => (
        <Icon key={Icon.displayName ?? Icon.name} className="size-4" />
      ))}
    </div>
  );
}
