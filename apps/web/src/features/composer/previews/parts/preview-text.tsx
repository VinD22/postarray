'use client';

/**
 * The post body as the platform will show it.
 *
 * Mentions and hashtags are tinted with the product's own accent, not with a
 * platform blue, and a mention is only tinted where the snapshot says the
 * platform resolves mentions at all. Somewhere the mention will not link, it
 * reads as the plain text it will be.
 */

import { useId, useState, type ReactNode } from 'react';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';
import { VisuallyHidden } from '@relay/design-system/primitives';

import { collapseText } from '../truncation';
import type { PresentationRule } from '../types';

export interface PreviewTextProps {
  readonly text: string;
  readonly presentation: PresentationRule;
  readonly resolvesMentions: boolean;
  readonly className?: string;
}

const TOKEN = /(@[\p{L}\p{N}_.]+|#[\p{L}\p{N}_]+|https?:\/\/[^\s<>"')]+)/gu;

function tokenize(text: string, resolvesMentions: boolean): ReactNode[] {
  return text.split(TOKEN).map((piece, index) => {
    if (piece.length === 0) {
      return null;
    }
    const key = `${index}-${piece}`;
    const isMention = piece.startsWith('@');
    const isHashtag = piece.startsWith('#');
    const isUrl = piece.startsWith('http');
    const accented = isUrl || isHashtag || (isMention && resolvesMentions);
    if (!accented) {
      return <span key={key}>{piece}</span>;
    }
    return (
      <span key={key} className="text-text-accent">
        {piece}
      </span>
    );
  });
}

export function PreviewText({
  text,
  presentation,
  resolvesMentions,
  className,
}: PreviewTextProps): ReactNode {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);
  const hiddenId = useId();
  const collapse = collapseText(text, presentation);

  if (text.length === 0) {
    return (
      <p className={cn('text-body-md text-text-tertiary', className)}>
        {t.full('composerWeb.preview.empty')}
      </p>
    );
  }

  if (!collapse.collapsed) {
    return (
      <p className={cn('text-body-md text-text-primary whitespace-pre-wrap', className)}>
        {tokenize(text, resolvesMentions)}
      </p>
    );
  }

  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      <p className="text-body-md text-text-primary whitespace-pre-wrap">
        {tokenize(collapse.visible, resolvesMentions)}
        <span id={hiddenId} hidden={!expanded}>
          {tokenize(collapse.hidden, resolvesMentions)}
        </span>
      </p>
      {/*
        A screen reader gets the whole body either way. The control is about
        the visual truncation the platform applies, not about withholding the
        text from anybody.
      */}
      {expanded ? null : (
        <VisuallyHidden>{text}</VisuallyHidden>
      )}
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={hiddenId}
        className="text-label text-text-accent underline-offset-2 hover:underline"
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded
          ? t.full('composerWeb.preview.seeLess')
          : t.full(presentation.collapse?.labelKey ?? 'composerWeb.preview.seeMore')}
      </button>
    </div>
  );
}
