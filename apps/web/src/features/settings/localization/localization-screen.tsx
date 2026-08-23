'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import {
  Button,
  Checkbox,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@relay/design-system/primitives';
import { DefinitionList, Notice, PageHeader } from '@relay/design-system/patterns';
import { ACTIVE_LOCALES, toDate } from '@relay/i18n';
import { useI18n, useTranslations } from '@relay/i18n/react';

import { AsyncBoundary } from '../lib/async-boundary';
import { workspaceGateway, type WorkspaceLocalizationView } from '../lib/gateway';
import { useFormatters } from '../lib/formatters';
import { settingsKey, useWorkspaceId } from '../lib/keys';
import { fromLines, toLines } from '../lib/lines';
import { useSettingsMutation } from '../lib/use-settings-mutation';
import { SettingRow, SettingsPanel, SettingsStack } from '../components/section';
import { LOCALE_COOKIE, localizedHref } from '@/lib/i18n/routing';
import { CONTENT_LOCALE_OPTIONS } from './localization-options';

/** A fixed sample instant, so the preview never depends on when it is read. */
const PREVIEW_INSTANT = '2026-08-11T14:30:00.000Z';

/**
 * Sunday, Monday and Saturday of one known week, used only to render the three
 * week start choices with the runtime's own weekday names.
 */
const WEEK_START_SAMPLES = [
  { value: 0, iso: '2026-08-02T12:00:00.000Z' },
  { value: 1, iso: '2026-08-03T12:00:00.000Z' },
  { value: 6, iso: '2026-08-08T12:00:00.000Z' },
] as const;

export function LocalizationScreen(): ReactNode {
  const t = useTranslations();
  const { locale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const section = t('settings.ui.section.localization');
  const formatters = useFormatters();
  const workspaceId = useWorkspaceId();
  const LOCALIZATION_KEY = settingsKey(workspaceId, 'localization');

  const settings = useQuery({
    queryKey: LOCALIZATION_KEY,
    queryFn: () => workspaceGateway.localization(),
  });

  const save = useSettingsMutation({
    section,
    mutationFn: workspaceGateway.updateLocalization,
    invalidate: [LOCALIZATION_KEY],
  });

  const [markets, setMarkets] = useState<string | null>(null);
  const current = settings.data;
  const currentInterfaceLocale = ACTIVE_LOCALES.find(
    (candidate) => candidate.bcp47 === current?.interfaceLocale,
  );
  const marketValue = markets ?? toLines(current?.markets ?? []);

  function update(patch: Partial<WorkspaceLocalizationView>): void {
    void save.run(patch);
  }

  async function updateInterfaceLocale(nextLocale: string): Promise<void> {
    if (nextLocale === current?.interfaceLocale) {
      return;
    }

    const saved = await save.run({ interfaceLocale: nextLocale });
    if (saved === undefined) {
      return;
    }

    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(nextLocale)}; path=/; SameSite=Lax; max-age=31536000`;
    const pathWithoutLocale = pathname.startsWith(`/${locale}/`)
      ? pathname.slice(locale.length + 1)
      : pathname === `/${locale}`
        ? '/'
        : pathname;
    router.push(localizedHref(pathWithoutLocale, nextLocale));
  }

  function weekdayName(iso: string): string {
    return new Intl.DateTimeFormat(formatters.locale, {
      weekday: 'long',
      timeZone: 'UTC',
    }).format(toDate(iso));
  }

  return (
    <>
      <PageHeader title={section} description={t('settings.ui.localization.description')} />

      <SettingsStack>
        <AsyncBoundary
          section={section}
          isPending={settings.isPending}
          error={settings.error}
          onRetry={() => void settings.refetch()}
          skeletonRows={4}
          skeletonColumns={2}
        >
          {current === undefined ? null : (
            <>
              <SettingsPanel
                title={t('settings.localization.interfaceLocale')}
                description={t('settings.localization.interfaceLocaleHelp')}
              >
                {currentInterfaceLocale?.reviewStatus === 'beta' ? (
                  <Notice tone="neutral" title={t('settings.localization.betaHelp')} />
                ) : null}
                <div className="flex flex-col">
                  <SettingRow
                    label={t('settings.localization.interfaceLocale')}
                    control={
                      <Select
                        value={current.interfaceLocale}
                        onValueChange={(value) => {
                          void updateInterfaceLocale(value);
                        }}
                      >
                        <SelectTrigger
                          className="min-w-48"
                          aria-label={t('settings.localization.interfaceLocale')}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ACTIVE_LOCALES.map((locale) => (
                            <SelectItem key={locale.bcp47} value={locale.bcp47}>
                              {locale.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    }
                  />
                </div>
              </SettingsPanel>

              <SettingsPanel
                title={t('settings.localization.contentLocales')}
                description={t('settings.localization.contentLocalesHelp')}
              >
                <ul className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
                  {CONTENT_LOCALE_OPTIONS.map((locale) => {
                    const checked = current.contentLocales.includes(locale.bcp47);
                    return (
                      <li key={locale.bcp47}>
                        <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(next) =>
                              update({
                                contentLocales:
                                  next === true
                                    ? [...current.contentLocales, locale.bcp47]
                                    : current.contentLocales.filter(
                                        (code) => code !== locale.bcp47,
                                      ),
                              })
                            }
                          />
                          <span className="min-w-0">
                            {locale.name}
                            <span className="text-body-sm text-text-tertiary ms-1">
                              {locale.endonym}
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </SettingsPanel>

              <SettingsPanel
                title={t('settings.localization.marketLocales')}
                description={t('settings.ui.localization.marketHelp')}
              >
                <Field label={t('settings.localization.marketLocales')}>
                  {(control) => (
                    <Textarea
                      {...control}
                      autoGrow
                      minRows={3}
                      value={marketValue}
                      onChange={(event) => setMarkets(event.target.value)}
                      onBlur={(event) => update({ markets: fromLines(event.target.value) })}
                    />
                  )}
                </Field>
              </SettingsPanel>

              <SettingsPanel title={t('common.timeZone')}>
                <div className="flex flex-col">
                  <SettingRow
                    label={t('settings.localization.timeZone')}
                    description={formatters.timeZone}
                    control={
                      <Input
                        className="min-w-56"
                        aria-label={t('settings.localization.timeZone')}
                        defaultValue={current.timeZone}
                        onBlur={(event) => update({ timeZone: event.target.value })}
                      />
                    }
                  />
                  <SettingRow
                    label={t('settings.localization.weekStart')}
                    description={t('settings.ui.localization.weekStartHelp')}
                    control={
                      <Select
                        value={String(current.weekStart)}
                        onValueChange={(value) =>
                          update({ weekStart: value === '0' ? 0 : value === '6' ? 6 : 1 })
                        }
                      >
                        <SelectTrigger
                          className="min-w-40"
                          aria-label={t('settings.localization.weekStart')}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {WEEK_START_SAMPLES.map((day) => (
                            <SelectItem key={day.value} value={String(day.value)}>
                              {weekdayName(day.iso)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    }
                  />
                  <SettingRow
                    label={t('settings.localization.hourCycle.label')}
                    control={
                      <Select
                        value={current.hourCycle}
                        onValueChange={(value) =>
                          update({ hourCycle: value === 'h12' ? 'h12' : 'h23' })
                        }
                      >
                        <SelectTrigger
                          className="min-w-40"
                          aria-label={t('settings.localization.hourCycle.label')}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="h12">
                            {t('settings.localization.hourCycle.h12')}
                          </SelectItem>
                          <SelectItem value="h23">
                            {t('settings.localization.hourCycle.h23')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    }
                  />
                </div>
              </SettingsPanel>

              <SettingsPanel title={t('settings.ui.localization.previewTitle')}>
                <DefinitionList
                  items={[
                    {
                      id: 'date',
                      term: t('settings.ui.localization.previewDate'),
                      definition: formatters.exactDate(PREVIEW_INSTANT),
                    },
                    {
                      id: 'time',
                      term: t('settings.ui.localization.previewTime'),
                      definition: formatters.dateTime(PREVIEW_INSTANT),
                      hint: formatters.timeZone,
                    },
                    {
                      id: 'number',
                      term: t('settings.ui.localization.previewNumber'),
                      definition: formatters.number(1234567.89),
                    },
                    {
                      id: 'currency',
                      term: t('settings.ui.localization.previewCurrency'),
                      definition: formatters.money({ amountMinor: 2900, currency: 'USD' }),
                    },
                  ]}
                />
              </SettingsPanel>

              <div>
                <Button
                  variant="secondary"
                  loading={save.isSaving}
                  onClick={() => update({ markets: fromLines(marketValue) })}
                >
                  {t('action.saveChanges')}
                </Button>
              </div>
            </>
          )}
        </AsyncBoundary>
      </SettingsStack>
    </>
  );
}
