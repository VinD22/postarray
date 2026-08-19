import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@relay/design-system/utils';
import type { MessageKey, MessageValues } from '@relay/i18n/translate';

import { Reveal } from '@/components/motion';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  Body,
  Heading,
  Lede,
  Section,
  Split,
  Subheading,
} from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import {
  EditorialSection,
  EditorialDisplay,
} from '@/features/marketing/components/editorial';
import { marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, faqJsonLd } from '@/features/marketing/seo';
import { ROUTES, TOOL_LINKS } from '@/features/marketing/site';

/**
 * The shell every tool page renders inside.
 *
 * A Server Component on purpose. The heading, the explanation, the privacy
 * statement and the FAQ are all in the HTML before any JavaScript runs, which
 * is what makes the FAQ structured data legitimate: the questions are visibly
 * on the page, in the same wording, and there is exactly one entry per rendered
 * question. Only the interactive panel passed as `children` is a client island.
 */

export interface ToolFaqEntry {
  readonly id: string;
  readonly q: MessageKey;
  readonly a: MessageKey;
}

export interface ToolPageShellProps {
  readonly locale: string;
  readonly path: string;
  readonly titleKey: MessageKey;
  readonly ledeKey: MessageKey;
  readonly explainerTitleKey: MessageKey;
  readonly explainerBodyKey: MessageKey;
  /** An optional second paragraph under the explainer. */
  readonly explainerExtraKey?: MessageKey;
  readonly faq: readonly ToolFaqEntry[];
  /**
   * ICU arguments for this page's own copy: the title, the standfirst, the
   * explainer paragraphs and the questions.
   *
   * The generated tool pages differ only by the platform they are about, so
   * nine pages share one set of catalog sentences and pass the platform, its
   * ceiling and its counting rule in here. The shared furniture below never
   * takes them: a privacy promise is the same sentence on every tool.
   */
  readonly values?: MessageValues;
  /** Set on any tool that reads the generated limits dataset. */
  readonly showsBaselineNote?: boolean;
  /** An extra band between the questions and the list of other tools. */
  readonly related?: ReactNode;
  readonly children: ReactNode;
}

export async function ToolPageShell(props: ToolPageShellProps): Promise<ReactNode> {
  const { locale, path, faq, values, children } = props;
  const t = await marketingTranslator(locale);

  return (
    <>
      <EditorialSection tone="canvas">
        <Reveal className="max-w-[46rem]">
          <EditorialDisplay as="h1" size="lg">
            {t.format(props.titleKey, values)}
          </EditorialDisplay>
          <Lede className="mt-6">{t.format(props.ledeKey, values)}</Lede>
        </Reveal>
      </EditorialSection>

      <Section id="tool" ariaLabel={t.format(props.titleKey, values)}>
        {children}
      </Section>

      <Section id="how">
        <Split aside={<Heading>{t.format(props.explainerTitleKey, values)}</Heading>}>
          <Body>{t.format(props.explainerBodyKey, values)}</Body>
          {props.explainerExtraKey === undefined ? null : (
            <Body className="mt-4">{t.format(props.explainerExtraKey, values)}</Body>
          )}
          {props.showsBaselineNote === true ? (
            <>
              <Subheading as="h3" className="text-title-sm mt-8">
                {t.t('web.tools.shared.baselineTitle')}
              </Subheading>
              <Body className="mt-2">{t.t('web.tools.shared.baselineBody')}</Body>
              <p className="mt-4">
                <TextLink href={ROUTES.capabilities}>{t.t('nav.public.capabilities')}</TextLink>
              </p>
            </>
          ) : null}
        </Split>
      </Section>

      <Section id="privacy">
        <Split aside={<Heading>{t.t('web.tools.shared.privacyTitle')}</Heading>}>
          <Body>{t.t('web.tools.shared.privacyBody')}</Body>
          <Body className="mt-4">{t.t('web.tools.index.honesty')}</Body>
        </Split>
      </Section>

      <Section id="questions">
        <Heading className="max-w-[28ch]">{t.t('web.tools.shared.faqTitle')}</Heading>
        <div className="border-border-bold divide-border-bold mt-10 divide-y-2 border-t-2">
          {faq.map((item) => (
            <details key={item.id} className="group">
              <summary
                className={cn(
                  'flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-6',
                  'marker:content-none [&::-webkit-details-marker]:hidden',
                  'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                )}
              >
                <Subheading as="h3" className="text-title-sm text-pretty">
                  {t.format(item.q, values)}
                </Subheading>
                <ChevronDown
                  aria-hidden="true"
                  className="text-text-tertiary size-5 shrink-0 transition-transform duration-(--duration-fast) group-open:rotate-180"
                />
              </summary>
              <Body className="pb-6">{t.format(item.a, values)}</Body>
            </details>
          ))}
        </div>
      </Section>

      {props.related === undefined ? null : <Section id="related">{props.related}</Section>}

      <Section id="other-tools">
        <Split aside={<Heading>{t.t('web.tools.shared.otherTools')}</Heading>}>
          <ul className="border-border-default border-t">
            {TOOL_LINKS.filter((link) => link.href !== path).map((link) => (
              <li key={link.href} className="border-border-subtle border-b py-4">
                <TextLink href={link.href}>{t.format(link.labelKey)}</TextLink>
                {link.descriptionKey === undefined ? null : (
                  <p className="text-body-sm text-text-tertiary mt-1">
                    {t.format(link.descriptionKey)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Split>
      </Section>

      <JsonLd
        node={faqJsonLd(
          faq.map((item) => ({
            question: t.format(item.q, values),
            answer: t.format(item.a, values),
          })),
          locale,
        )}
      />
      <JsonLd
        node={breadcrumbJsonLd(
          [
            { name: t.t('web.tools.index.title'), path: ROUTES.tools },
            { name: t.format(props.titleKey, values), path },
          ],
          locale,
        )}
      />
    </>
  );
}
