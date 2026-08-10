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
  REVIEWED_LOCALES,
  REVIEWED_LOCALE_CODE_LIST,
  canonicalizeLocaleTag,
  getCardinalPluralCategories,
  getDirection,
  getLocale,
  isActiveLocale,
  isReviewedLocale,
  isRtl,
  parseAcceptLanguage,
  requireLocale,
  resolveLocale,
} from './locales';
export type {
  HourCycle,
  LocaleCode,
  LocaleDescriptor,
  LocaleFormatting,
  LocaleReviewStatus,
  LocaleStatus,
  PluralCategory,
  TextDirection,
  WeekDayIndex,
} from './locales';

export {
  LOCALE_REVIEWS,
  REVIEWED_LOCALE_CODES,
  REVIEW_PROMISE_LOCALE_CODES,
  getLocaleReview,
} from './reviews';
export type { LocaleReview } from './reviews';

export { CATALOGS, en, loadCatalog, messageKeys } from './messages/index';
export type {
  Catalog,
  CatalogLoader,
  EnglishCatalog,
  MessageKey,
  PartialCatalog,
} from './messages/index';

export {
  APPROVAL_STATES,
  CAPABILITY_LEVELS,
  PUBLISH_STATES,
  RELAY_ERROR_CODES,
  VALIDATION_ISSUE_CODES,
} from './codes';
export type {
  ApprovalState,
  CapabilityLevel,
  PublishState,
  RelayErrorCode,
  ValidationIssueCode,
} from './codes';

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
} from './format';
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
} from './format';

export {
  createCollectingReporter,
  createTranslator,
  scopeTranslator,
  silentReporter,
} from './translate';
export type {
  MessageArguments,
  MessageValue,
  MessageValues,
  MissingMessageReason,
  MissingMessageReport,
  MissingMessageReporter,
  Translator,
  TranslatorOptions,
} from './translate';

export {
  PSEUDO_LOCALES,
  PSEUDO_LOCALE_CODES,
  createPseudoCatalog,
  getPseudoLocale,
  isPseudoLocale,
  pseudoLocalize,
  pseudoLocalizeCatalog,
} from './pseudo';
export type { PseudoOptions, PseudoVariant } from './pseudo';

export { assertCatalogValid, formatLintResult, lintCatalog } from './lint';
export type { LintFinding, LintOptions, LintResult, LintRule, LintSeverity } from './lint';

export { collectArgumentNames, stripArguments, transformIcu } from './icu';
export type { IcuTransform } from './icu';
