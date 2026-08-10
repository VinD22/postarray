'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { Field, Input } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { UTM_FIELDS, composeUtmUrl, utmParameterName, type UtmField } from './utm';
import { CopyButton } from './result-parts';

/**
 * The UTM builder.
 *
 * No network, no storage. The composition itself is in `utm.ts`, which is where
 * the rules about preserving an existing query string and escaping a value are
 * tested. This component only holds the form.
 */

type FieldState = Record<UtmField, string>;

const EMPTY: FieldState = { source: '', medium: '', campaign: '', term: '', content: '' };

export function UtmBuilder(): ReactElement {
  const t = useTranslations();
  const [destination, setDestination] = useState('');
  const [values, setValues] = useState<FieldState>(EMPTY);

  const result = useMemo(() => composeUtmUrl(destination, values), [destination, values]);
  const destinationEntered = destination.trim() !== '';
  const invalid = destinationEntered && result.url === null;

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Field
          label={t.full('web.tools.utm.field.url.label')}
          description={t.full('web.tools.utm.field.url.help')}
          {...(invalid ? { error: t.full('web.tools.utm.field.url.invalid') } : {})}
        >
          {(control) => (
            <Input
              id={control.id}
              aria-describedby={control['aria-describedby']}
              aria-invalid={control['aria-invalid']}
              aria-errormessage={control['aria-errormessage']}
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          )}
        </Field>

        {UTM_FIELDS.map((field) => (
          <Field
            key={field}
            label={t(`web.tools.utm.field.${field}.label`)}
            description={t(`web.tools.utm.field.${field}.help`)}
          >
            {(control) => (
              <Input
                id={control.id}
                aria-describedby={control['aria-describedby']}
                autoComplete="off"
                spellCheck={false}
                value={values[field]}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [field]: event.target.value }))
                }
              />
            )}
          </Field>
        ))}
      </div>

      <section aria-labelledby="utm-result-heading" className="flex flex-col gap-4">
        <h2 id="utm-result-heading" className="text-title-sm text-text-primary">
          {t.full('web.tools.utm.result.title')}
        </h2>

        {result.url === null ? (
          <p className="text-body-sm text-text-tertiary">
            {t.full('web.tools.utm.result.empty')}
          </p>
        ) : (
          <>
            <output
              aria-label={t.full('web.tools.utm.result.label')}
              className="border-border-bold text-body-sm text-text-primary block border-2 p-4 font-mono break-all"
            >
              {result.url}
            </output>
            <CopyButton value={result.url} />
            {result.preservedExistingQuery ? (
              <p className="text-body-sm text-text-tertiary">
                {t.full('web.tools.utm.result.preserved')}
              </p>
            ) : null}
            {result.replaced.length > 0 ? (
              <p className="text-body-sm text-text-tertiary">
                {t.full('web.tools.utm.result.replaced')}
              </p>
            ) : null}
          </>
        )}

        <dl className="border-border-default mt-2 border-t">
          {UTM_FIELDS.map((field) => (
            <div key={field} className="border-border-subtle border-b py-3">
              <dt className="text-body-sm text-text-primary font-mono">
                {utmParameterName(field)}
              </dt>
              <dd className="text-body-sm text-text-tertiary mt-1">
                {t(`web.tools.utm.field.${field}.help`)}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
