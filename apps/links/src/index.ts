/**
 * `@relay/links`: the isolated short-link redirect service.
 *
 * It runs on its own registrable domain, separate from the app domain and the
 * API domain. That is not tidiness, it is the security boundary: this service
 * accepts attacker-controlled paths and emits 302s to third-party sites, so it
 * must never share a cookie scope with a session.
 *
 * The safety functions are exported because the create path in the application
 * service uses the same ones. A destination is checked when a link is made and
 * again every time it resolves.
 */

export {
  DEFAULT_ALLOWED_SCHEMES,
  DEFAULT_MAX_REDIRECT_DEPTH,
  DEFAULT_MAX_URL_LENGTH,
  SAFETY_REASONS,
  assertDestinationSafe,
  checkDestination,
  expandIpv6,
  isPrivateIpv4,
  isPrivateIpv6,
  isPubliclyRoutableHost,
  type SafetyDecision,
  type SafetyOptions,
  type SafetyReason,
} from './safety';

export {
  classifyBot,
  classifyDevice,
  classifyReferrer,
  normalizeCountry,
  type RequestSignals,
} from './classify';

export {
  DEFAULT_DEDUPE_RETENTION_SECONDS,
  DEFAULT_DEDUPE_WINDOW_SECONDS,
  buildDedupeKey,
  coarsenAddress,
  dedupeKeysMatch,
  windowStart,
  type DedupeInput,
  type DedupeResult,
} from './dedupe';

export {
  EMPTY_KILL_SWITCH_STATE,
  TtlCache,
  createKillSwitch,
  type CachedLookup,
  type KillSwitchState,
  type MutableKillSwitch,
  type TtlCacheOptions,
} from './cache';

export {
  DEFAULT_MISS_LIMIT,
  DEFAULT_MISS_WINDOW_SECONDS,
  DEFAULT_REQUEST_LIMIT,
  DEFAULT_REQUEST_WINDOW_SECONDS,
  createEnumerationGuard,
  createRateLimiter,
  type EnumerationGuard,
  type EnumerationGuardOptions,
  type FixedWindowOptions,
  type RateLimitDecision,
  type RateLimiter,
} from './rate-limit';

export {
  DEFAULT_FLUSH_INTERVAL_MS,
  DEFAULT_MAX_BATCH_SIZE,
  DEFAULT_MAX_BUFFERED_EVENTS,
  createBufferedClickSink,
  createMemoryClickSink,
  type BufferedClickSink,
  type BufferedClickSinkOptions,
} from './clicks';

export {
  createMemoryShortLinkStore,
  createSqlClickWriter,
  createSqlShortLinkStore,
  type MemoryShortLinkStore,
  type SqlQueryable,
} from './store';

export {
  DEFAULT_HIT_TTL_SECONDS,
  DEFAULT_MISS_TTL_SECONDS,
  createResolver,
  type RefusalReason,
  type ResolveOutcome,
  type Resolver,
  type ResolverOptions,
} from './resolve';

export {
  NOTICE_HEADERS,
  escapeHtml,
  renderNoticePage,
  renderRateLimitedPage,
  type NoticePageInput,
} from './pages';

export { createLinksServer, type LinksServer, type LinksServerOptions } from './server';

export {
  BOT_CLASSES,
  DEVICE_CLASSES,
  REFERRER_CLASSES,
  SAFETY_VERDICTS,
  SHORT_LINK_STATES,
  SLUG_PATTERN,
  abuseReportSchema,
  safetyVerdictSchema,
  shortLinkRecordSchema,
  shortLinkStateSchema,
  slugSchema,
  type AbuseReport,
  type AbuseReportSink,
  type BotClass,
  type ClickEvent,
  type ClickSink,
  type ClickWriter,
  type DeviceClass,
  type KillSwitch,
  type ReferrerClass,
  type SafetyVerdict,
  type ShortLinkLookup,
  type ShortLinkRecord,
  type ShortLinkState,
  type ShortLinkStore,
} from './types';

export {
  fixedClock,
  parseInstantMs,
  systemClock,
  toIsoInstant,
  truncateToHour,
  type Clock,
} from './clock';
