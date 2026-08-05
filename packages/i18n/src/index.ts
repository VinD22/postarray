/**
 * `@relay/i18n`
 *
 * Every user visible string in the product lives here. V1 ships English only,
 * and adding a language is a catalog file plus a status change in
 * `locales.ts`. See README.md.
 *
 * The React binding is exported from `@relay/i18n/react` rather than from this
 * entry point, so server code and the CLI never pull React in.
 */

export {
  ACTIVE_LOCALES,
  ACTIVE_LOCALE_CODES,
  ALL_LOCALES,
  ALL_LOCALE_CODES,
  DEFAULT_LOCALE,
  PLANNED_LOCALES,
  canonicalizeLocaleTag,
  getCardinalPluralCategories,
  getDirection,
  getLocale,
  isActiveLocale,
  isRtl,
  parseAcceptLanguage,
  requireLocale,
  resolveLocale,
} from './locales.js';
export type {
  HourCycle,
  LocaleCode,
  LocaleDescriptor,
  LocaleFormatting,
  LocaleStatus,
  PluralCategory,
  TextDirection,
  WeekDayIndex,
} from './locales.js';

export { CATALOGS, en, loadCatalog, messageKeys } from './messages/index.js';
export type {
  Catalog,
  CatalogLoader,
  EnglishCatalog,
  MessageKey,
  PartialCatalog,
} from './messages/index.js';

export {
  APPROVAL_STATES,
  CAPABILITY_LEVELS,
  PUBLISH_STATES,
  RELAY_ERROR_CODES,
  VALIDATION_ISSUE_CODES,
} from './codes.js';
export type {
  ApprovalState,
  CapabilityLevel,
  PublishState,
  RelayErrorCode,
  ValidationIssueCode,
} from './codes.js';

export {
  calendarDayNumber,
  crossesOffsetChange,
  formatBytes,
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDateTimeParts,
  formatDuration,
  formatList,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatTime,
  formatTimeZoneLabel,
  formatTimeZoneOffset,
  getCurrencyExponent,
  getTimeZoneOffsetMinutes,
  isValidTimeZone,
  toDate,
} from './format.js';
export type {
  CurrencyFormatOptions,
  DateFormatOptions,
  DateInput,
  DateStyle,
  DateTimeFormatOptions,
  DurationFormatOptions,
  RelativeTimeOptions,
  TimeFormatOptions,
  TimeStyle,
  TimeZoneLabelOptions,
} from './format.js';

export {
  createCollectingReporter,
  createTranslator,
  scopeTranslator,
  silentReporter,
} from './translate.js';
export type {
  MessageArguments,
  MessageValue,
  MessageValues,
  MissingMessageReason,
  MissingMessageReport,
  MissingMessageReporter,
  Translator,
  TranslatorOptions,
} from './translate.js';

export {
  PSEUDO_LOCALES,
  PSEUDO_LOCALE_CODES,
  createPseudoCatalog,
  getPseudoLocale,
  isPseudoLocale,
  pseudoLocalize,
  pseudoLocalizeCatalog,
} from './pseudo.js';
export type { PseudoOptions, PseudoVariant } from './pseudo.js';

export { assertCatalogValid, formatLintResult, lintCatalog } from './lint.js';
export type { LintFinding, LintOptions, LintResult, LintRule, LintSeverity } from './lint.js';

export { collectArgumentNames, stripArguments, transformIcu } from './icu.js';
export type { IcuTransform } from './icu.js';
