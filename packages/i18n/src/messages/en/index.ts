import { a11yMessages } from './a11y.js';
import { actionMessages } from './actions.js';
import { analyticsMessages } from './analytics.js';
import { authMessages } from './auth.js';
import { automationMessages } from './automation.js';
import { billingMessages } from './billing.js';
import { calendarMessages } from './calendar.js';
import { commonMessages } from './common.js';
import { composerMessages } from './composer.js';
import { connectionMessages } from './connections.js';
import { developerMessages } from './developer.js';
import { errorMessages } from './errors.js';
import { growthMessages } from './growth.js';
import { navMessages } from './nav.js';
import { onboardingMessages } from './onboarding.js';
import { receiptMessages } from './receipt.js';
import { settingsMessages } from './settings.js';
import { stateMessages } from './states.js';
import { statusMessages } from './status.js';
import { validationMessages } from './validation.js';
import { webMarketingMessages } from './web-marketing.js';
import { webAnalyticsMessages } from './web-analytics.js';
import { webCalendarMessages } from './web-calendar.js';
import { webComposerMessages } from './web-composer.js';
import { webSettingsMessages } from './web-settings.js';
import { webShellMessages } from './web-shell.js';

/**
 * The English catalog. This is the source of truth for every user visible
 * string in the product, and the type from which `MessageKey` is derived.
 *
 * Keys are intent based and stable. Never key a message by its English text.
 * Values are ICU MessageFormat. Never concatenate two messages.
 */
export const en = {
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
  ...billingMessages,
  ...settingsMessages,
  ...developerMessages,
  ...authMessages,
  ...onboardingMessages,
  ...errorMessages,
  ...validationMessages,
  ...stateMessages,
  ...statusMessages,
  ...a11yMessages,
  ...webMarketingMessages,
  ...webSettingsMessages,
  ...webShellMessages,
} as const;

/** Every message key in the product. */
export type MessageKey = keyof typeof en;

/** The English catalog type. A translated catalog is a partial of this. */
export type EnglishCatalog = typeof en;

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
