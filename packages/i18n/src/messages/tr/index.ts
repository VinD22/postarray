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
import { digestMessages } from './digest';
import { emailMessages } from './email';
import { errorMessages } from './errors';
import { growthMessages } from './growth';
import { importMessages } from './import';
import { mediaMessages } from './media';
import { navMessages } from './nav';
import { onboardingMessages } from './onboarding';
import { postingSetMessages } from './posting-sets';
import { queueMessages } from './queue';
import { receiptMessages } from './receipt';
import { settingsMessages } from './settings';
import { stateMessages } from './states';
import { statusMessages } from './status';
import { validationMessages } from './validation';
import { webMarketingMessages } from './web-marketing';
import { webAnalyticsMessages } from './web-analytics';
import { webBlogMessages } from './web-blog';
import { webCalendarMessages } from './web-calendar';
import { webComparisonMessages } from './web-comparisons';
import { webComposerMessages } from './web-composer';
import { webDemoMessages } from './web-demo';
import { webPlatformsMessages } from './web-platforms';
import { webSettingsMessages } from './web-settings';
import { webToolsMessages } from './web-tools';
import { webUseCaseMessages } from './web-use-cases';
import { webShellMessages } from './web-shell';
import { withoutBetaEnglishFallbacks } from '../beta-fallbacks';

/**
 * Turkish is a beta interface locale. Legal, billing, and consent statements
 * intentionally stay out of this catalog until they have human translation
 * review. The translator falls back to the controlling English copy for them.
 */
export const tr = {
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
  ...digestMessages,
  ...emailMessages,
  ...mediaMessages,
  ...webBlogMessages,
  ...webComparisonMessages,
  ...webUseCaseMessages,
  ...queueMessages,
  ...postingSetMessages,
  ...importMessages,
  ...webPlatformsMessages,
  ...webDemoMessages,
  ...webToolsMessages,
} as const;

/** Every message key in the product. */
export type MessageKey = keyof typeof tr;

/** A beta Turkish catalog. The full English catalog remains the key source of truth. */
export type TurkishCatalog = typeof tr;

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
  digestMessages,
  emailMessages,
  errorMessages,
  growthMessages,
  mediaMessages,
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
  webBlogMessages,
  webComparisonMessages,
  webComposerMessages,
  webCalendarMessages,
  webAnalyticsMessages,
};
