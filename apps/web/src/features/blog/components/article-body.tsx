import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';

import { Body, Heading, List } from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';

import type { BlogBlock } from '../types';

/**
 * The one renderer every article goes through.
 *
 * Article modules choose blocks, never markup. That is the whole point of the
 * typed block union: heading level, measure, list grammar and table shape are
 * decided here, once, so the twelfth article cannot quietly introduce an `h4`
 * under an `h2`, a different bullet style or a wider text column.
 *
 * Every block maps onto a component the marketing site already uses, so an
 * article inherits the site's reading grammar rather than inventing a second
 * one.
 */

function BlockContent({ block }: { block: BlogBlock }): ReactNode {
  switch (block.kind) {
    case 'heading':
      return (
        <Heading
          as="h2"
          id={block.id}
          className="scroll-mt-24 text-[clamp(1.35rem,1.1rem+0.8vw,1.8rem)]"
        >
          {block.text}
        </Heading>
      );

    case 'paragraph':
      return <Body>{block.text}</Body>;

    case 'list':
      return block.ordered === true ? (
        <ol className="space-y-3">
          {block.items.map((item, index) => (
            <li
              // eslint-disable-next-line react/no-array-index-key -- static editorial copy
              key={index}
              className="text-body-lg text-text-secondary flex gap-3 leading-[1.6]"
            >
              <span
                aria-hidden="true"
                className="text-body-sm text-text-tertiary mt-[0.25em] shrink-0 font-mono tabular-nums"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="max-w-[66ch] min-w-0">{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <List items={block.items} />
      );

    case 'callout':
      return <Notice tone="neutral" title={block.title} description={block.body} />;

    case 'code':
      return (
        <figure className="space-y-2">
          <div className="border-border-bold relative overflow-x-auto border-y-2 py-4">
            <pre className="text-body-sm text-text-primary font-mono leading-[1.7]">
              <code>{block.lines.join('\n')}</code>
            </pre>
          </div>
          <figcaption className="text-body-sm text-text-tertiary max-w-[64ch] leading-[1.6]">
            {block.caption}
          </figcaption>
        </figure>
      );

    case 'table':
      return (
        <TableContainer className="relay-scrollbar border-border-bold border-y-2">
          <Table density="comfortable" className="min-w-[36rem]">
            <TableCaption className="text-start">{block.caption}</TableCaption>
            <TableHeader>
              <TableRow className="border-border-bold border-b-2">
                {block.columns.map((column) => (
                  <TableHead key={column} className="min-w-[14rem]">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {block.rows.map((row) => (
                <TableRow key={row.join('|')}>
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <TableRowHeader
                        key={cell}
                        className="text-body-md text-text-primary align-top"
                      >
                        {cell}
                      </TableRowHeader>
                    ) : (
                      <TableCell
                        key={cell}
                        className="text-text-secondary align-top whitespace-normal"
                      >
                        {cell}
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );

    case 'cta':
      return (
        <p className="text-body-lg">
          <TextLink href={block.href}>{block.label}</TextLink>
        </p>
      );
  }
}

export function ArticleBody({ blocks }: { blocks: readonly BlogBlock[] }): ReactNode {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key -- static editorial copy
          key={index}
          className={block.kind === 'heading' && index > 0 ? 'pt-6' : undefined}
        >
          <BlockContent block={block} />
        </div>
      ))}
    </div>
  );
}
