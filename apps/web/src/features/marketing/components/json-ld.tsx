import type { ReactNode } from 'react';

import { jsonLdScript } from '../seo';

/**
 * A structured data block.
 *
 * The payload is built in `seo.ts` from our own message catalog and static
 * route table. It never contains user input, and `jsonLdScript` escapes every
 * `<` so the string cannot close the script element. Raw insertion is required
 * because React escapes the quotation marks in a text child, which would make
 * the JSON unparseable.
 */
export function JsonLd({ node }: { node: Readonly<Record<string, unknown>> }): ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(node) }}
    />
  );
}
