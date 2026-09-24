import type { ReactNode } from 'react';

import { JsonLd } from '@/features/marketing/components/json-ld';
import { Body, Heading, Section, Split, Subheading } from '@/features/marketing/components/layout';
import { faqJsonLd } from '@/features/marketing/seo';

export interface PageFaqEntry {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

/**
 * Visible questions plus the matching `FAQPage` node.
 *
 * The structured data is built from the same strings the reader sees, so the
 * two cannot drift: a question in the JSON-LD that is not on the page is a
 * guideline violation, and this component makes it impossible to write one.
 */
export function PageFaq({
  title,
  entries,
  locale,
}: {
  readonly title: string;
  readonly entries: readonly PageFaqEntry[];
  readonly locale: string;
}): ReactNode {
  if (entries.length === 0) {
    return null;
  }
  return (
    <Section id="questions">
      <Split aside={<Heading>{title}</Heading>}>
        <div className="space-y-8">
          {entries.map((entry) => (
            <div key={entry.id}>
              <Subheading as="h3">{entry.question}</Subheading>
              <Body className="mt-2">{entry.answer}</Body>
            </div>
          ))}
        </div>
      </Split>
      <JsonLd
        node={faqJsonLd(
          entries.map((entry) => ({ question: entry.question, answer: entry.answer })),
          locale,
        )}
      />
    </Section>
  );
}
