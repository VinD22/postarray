import { a11yMessages } from './a11y';
import { actionMessages } from './actions';
import { analyticsMessages } from './analytics';
import { authMessages } from './auth';
import { automationMessages } from './automation';
import { billingMessages } from './billing';
import { calendarMessages } from './calendar';
import { commonMessages } from './common';
import { composerMessages } from './composer';
import { connectionMessages } from './connections';
import { developerMessages } from './developer';
import { errorMessages } from './errors';
import { growthMessages } from './growth';
import { navMessages } from './nav';
import { onboardingMessages } from './onboarding';
import { receiptMessages } from './receipt';
import { settingsMessages } from './settings';
import { stateMessages } from './states';
import { statusMessages } from './status';
import { validationMessages } from './validation';
import { webMarketingMessages } from './web-marketing';
import { webAnalyticsMessages } from './web-analytics';
import { webCalendarMessages } from './web-calendar';
import { webComposerMessages } from './web-composer';
import { webSettingsMessages } from './web-settings';
import { webShellMessages } from './web-shell';
import { withoutBetaEnglishFallbacks } from '../beta-fallbacks';

/**
 * The German beta catalog. This is the source of truth for every user visible
 * string in the product, and the type from which `MessageKey` is derived.
 *
 * Keys are intent based and stable. Never key a message by its English text.
 * Values are ICU MessageFormat. Never concatenate two messages.
 */
/**
 * German is a beta interface locale. Legal, billing, and consent statements
 * intentionally stay out of this catalog until they have human translation
 * review. The translator falls back to the controlling English copy for them.
 */
export const de = {
  ...navMessages,
  ...actionMessages,
  ...commonMessages,
  ...composerMessages,
  ...webComposerMessages,
  ...calendarMessages,
  ...receiptMessages,
  ...connectionMessages,
  ...webCalendarMessages,
  ...analyticsMessages,
  ...automationMessages,
  ...webAnalyticsMessages,
  ...growthMessages,
  // `billing.*` is English fallback pending legal/commercial review.
  // `settings.data.*` includes privacy and consent controls.
  ...withoutBetaEnglishFallbacks(settingsMessages),
  ...developerMessages,
  ...authMessages,
  ...onboardingMessages,
  ...errorMessages,
  ...validationMessages,
  ...stateMessages,
  ...statusMessages,
  ...a11yMessages,
  // The legal and price/trial sections are English fallback pending review.
  ...withoutBetaEnglishFallbacks(webMarketingMessages),
  ...withoutBetaEnglishFallbacks(webSettingsMessages),
  ...webShellMessages,
} as const;

/** Every message key in the product. */
export type MessageKey = keyof typeof de;

/** The German catalog type. A translated catalog is a partial of this. */
export type GermanCatalog = typeof de;

export {
  a11yMessages,
  actionMessages,
  analyticsMessages,
  authMessages,
  automationMessages,
  billingMessages,
  calendarMessages,
  commonMessages,
  composerMessages,
  connectionMessages,
  developerMessages,
  errorMessages,
  growthMessages,
  navMessages,
  onboardingMessages,
  receiptMessages,
  settingsMessages,
  stateMessages,
  statusMessages,
  validationMessages,
  webMarketingMessages,
  webSettingsMessages,
  webShellMessages,
  webComposerMessages,
  webCalendarMessages,
  webAnalyticsMessages,
};
