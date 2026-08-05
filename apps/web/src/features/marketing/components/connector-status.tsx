import type { ReactNode } from 'react';
import { CapabilityBadge, type CapabilityState } from '@relay/design-system/patterns';

import { marketingTranslator } from '../i18n';
import { CAPABILITY_COLUMNS, CONNECTORS } from '../data/connectors';

/**
 * The connector section of the status page.
 *
 * A connector has one honest overall state today, derived from its cells
 * rather than typed by hand: if nothing is supported, the connector is not
 * live. The moment a cell becomes `supported` this row starts telling the
 * truth about it without anyone remembering to edit a second file.
 */
function overallState(connectorIndex: number): CapabilityState {
  const connector = CONNECTORS[connectorIndex];
  if (!connector) {
    return 'not_implemented';
  }
  const states = CAPABILITY_COLUMNS.map((column) => connector.capabilities[column].state);
  if (states.some((state) => state === 'supported')) {
    return 'supported';
  }
  if (states.some((state) => state === 'requires_review')) {
    return 'requires_review';
  }
  return 'not_implemented';
}

export function CapabilityMatrixSummary(): ReactNode {
  const t = marketingTranslator();

  return (
    <dl className="border-border-default border-t">
      {CONNECTORS.map((connector, index) => {
        const state = overallState(index);
        return (
          <div
            key={connector.id}
            className="border-border-subtle flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b py-4"
          >
            <dt className="text-body-lg text-text-primary">{t.format(connector.nameKey)}</dt>
            <dd>
              <CapabilityBadge state={state} label={t.format(`web.capabilities.short.${state}`)} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
