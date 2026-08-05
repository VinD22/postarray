import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

export interface SettingsPanelProps {
  /** The panel heading. Rendered as an h2 inside a settings screen. */
  title: ReactNode;
  description?: ReactNode;
  /** Actions that belong to this panel, not to the page. */
  actions?: ReactNode;
  /** A note under the body: an attribution line, a source and date. */
  footnote?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
}

/**
 * One block of a settings screen.
 *
 * A panel is a heading, a sentence and content separated by a hairline rule.
 * There is no card, no shadow and no nesting: settings are a document, and a
 * document with twelve floating rectangles is harder to scan than a document
 * with twelve headings.
 */
export function SettingsPanel({
  title,
  description,
  actions,
  footnote,
  children,
  id,
  className,
}: SettingsPanelProps): ReactNode {
  return (
    <section
      id={id}
      className={cn('flex flex-col gap-3 border-t border-border-subtle pt-6', className)}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-title-sm text-text-primary">{title}</h2>
          {description ? (
            <p className="max-w-[68ch] text-body-md text-text-secondary">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>

      {children}

      {footnote ? <p className="text-body-sm text-text-tertiary">{footnote}</p> : null}
    </section>
  );
}

export interface SettingRowProps {
  /** The setting name. Associate it with the control through `htmlFor`. */
  label: ReactNode;
  description?: ReactNode;
  /** The control, or the current value when the row is read only. */
  control: ReactNode;
  className?: string;
}

/**
 * A single setting as a row: name and explanation on the inline start, control
 * on the inline end, stacked below 768px. This is the shape that replaces a
 * grid of small cards.
 */
export function SettingRow({
  label,
  description,
  control,
  className,
}: SettingRowProps): ReactNode {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 border-b border-border-subtle py-3 last:border-b-0',
        'md:flex-row md:items-start md:justify-between md:gap-6',
        className,
      )}
    >
      <div className="flex min-w-0 max-w-[52ch] flex-col gap-1">
        <span className="text-body-md font-medium text-text-primary">{label}</span>
        {description ? (
          <span className="text-body-sm text-text-secondary">{description}</span>
        ) : null}
      </div>
      <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2 md:justify-end">
        {control}
      </div>
    </div>
  );
}

/** The vertical stack a settings screen body uses. */
export function SettingsStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div className={cn('flex flex-col gap-6 px-4 py-6 md:px-6', className)}>{children}</div>
  );
}

/**
 * A pair of facts rendered as a sentence rather than a metric tile: the label
 * in muted text, the value in primary text, on one line where there is room.
 */
export function InlineFact({
  label,
  value,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <p className={cn('text-body-md text-text-secondary', className)}>
      <span className="text-text-tertiary">{label}</span>{' '}
      <span className="font-medium text-text-primary tabular-nums">{value}</span>
    </p>
  );
}
