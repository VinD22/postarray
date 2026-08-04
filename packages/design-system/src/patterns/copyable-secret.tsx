'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { cn } from '../utils/cn.js';
import { Button } from '../primitives/button.js';
import { Code } from '../primitives/code.js';
import { IconButton } from '../primitives/icon-button.js';
import { Notice } from './notice.js';
import { useAnnouncer } from '../hooks/use-announcer.js';

export interface CopyableSecretMessages {
  /** Heading for the one-time warning notice. */
  readonly warningTitle: ReactNode;
  /** Explains that this value cannot be shown again after leaving. */
  readonly warningDescription: ReactNode;
  readonly copyLabel: string;
  /** Announced politely after a successful copy. */
  readonly copiedLabel: string;
  readonly revealLabel: string;
  readonly hideLabel: string;
  /** Shown once the value has been dismissed and can no longer be read. */
  readonly consumedText: ReactNode;
  /** The label for the acknowledge action that consumes the reveal. */
  readonly acknowledgeLabel: string;
  /** Accessible name for the secret value region. */
  readonly valueLabel: string;
}

export interface CopyableSecretProps {
  /** The secret. Held only for this render; never persisted by this component. */
  value: string;
  messages: CopyableSecretMessages;
  /**
   * Called when the user acknowledges. The parent is expected to drop the
   * value from its own state at this point, which is what makes the one-time
   * semantics real rather than cosmetic.
   */
  onAcknowledge?: () => void;
  className?: string;
}

/**
 * A one-time secret reveal: an API key, a client secret, a service account
 * credential.
 *
 * The semantics the product promises are enforced here. The value starts
 * masked, revealing is a deliberate act, and acknowledging replaces the value
 * with a permanent explanation that it cannot be shown again. There is no
 * "show it once more".
 *
 * The value is never written to the DOM in a form that survives the
 * acknowledgement, is never placed in an input with autocomplete, and the copy
 * action reports success through the announcer rather than a tooltip.
 */
export function CopyableSecret({
  value,
  messages,
  onAcknowledge,
  className,
}: CopyableSecretProps): ReactNode {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [consumed, setConsumed] = useState(false);
  const { announce } = useAnnouncer();

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      announce(messages.copiedLabel, 'polite');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied. The value stays selectable by hand,
      // which is why it is rendered as text rather than as a masked input.
      setRevealed(true);
    }
  }, [announce, messages.copiedLabel, value]);

  if (consumed) {
    return (
      <p className={cn('text-body-sm text-text-secondary', className)}>
        {messages.consumedText}
      </p>
    );
  }

  const masked = '•'.repeat(Math.min(value.length, 40));

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Notice
        tone="warning"
        title={messages.warningTitle}
        description={messages.warningDescription}
      />

      <div
        role="group"
        aria-label={messages.valueLabel}
        className={cn(
          'flex items-center gap-2 rounded-md border border-border-default',
          'bg-surface-sunken px-2.5 py-2',
        )}
      >
        <Code className="min-w-0 flex-1 overflow-x-auto border-0 bg-transparent px-0 py-0">
          {revealed ? value : masked}
        </Code>
        <IconButton
          size="sm"
          variant="ghost"
          label={revealed ? messages.hideLabel : messages.revealLabel}
          icon={
            revealed ? (
              <EyeOff aria-hidden="true" />
            ) : (
              <Eye aria-hidden="true" />
            )
          }
          onClick={() => setRevealed((current) => !current)}
        />
        <IconButton
          size="sm"
          variant="secondary"
          label={messages.copyLabel}
          icon={copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          onClick={() => {
            void copy();
          }}
        />
      </div>

      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setConsumed(true);
            setRevealed(false);
            onAcknowledge?.();
          }}
        >
          {messages.acknowledgeLabel}
        </Button>
      </div>
    </div>
  );
}
