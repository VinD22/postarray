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
import { webAnalyticsMessages } from './web-analytics';
import { webCalendarMessages } from './web-calendar';
import { webComposerMessages } from './web-composer';
import { webMarketingMessages } from './web-marketing';
import { webSettingsMessages } from './web-settings';
import { webShellMessages } from './web-shell';
import { withoutBetaEnglishFallbacks } from '../beta-fallbacks';

/** Simplified Chinese is a beta interface locale. B5-controlled legal and billing
 * copy remains in reviewed English until human translation review is complete. */
export const zhHans = {
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
  ...withoutBetaEnglishFallbacks(billingMessages),
  ...withoutBetaEnglishFallbacks(settingsMessages),
  ...developerMessages,
  ...authMessages,
  ...onboardingMessages,
  ...errorMessages,
  ...validationMessages,
  ...stateMessages,
  ...statusMessages,
  ...a11yMessages,
  ...withoutBetaEnglishFallbacks(webMarketingMessages),
  ...withoutBetaEnglishFallbacks(webSettingsMessages),
  ...webShellMessages,
} as const;

export type SimplifiedChineseCatalog = typeof zhHans;
