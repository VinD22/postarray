import { a11yMessages } from './a11y';
import { actionMessages } from './actions';
import { analyticsMessages } from './analytics';
import { assistantMessages } from './assistant';
import { assistantWebMessages } from './assistant-web';
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
import { webBlogMessages } from './web-blog';
import { webComparisonMessages } from './web-comparisons';
import { webDemoMessages } from './web-demo';
import { webMarketingMessages } from './web-marketing';
import { webPlatformsMessages } from './web-platforms';
import { webAnalyticsMessages } from './web-analytics';
import { webCalendarMessages } from './web-calendar';
import { webComposerMessages } from './web-composer';
import { webSettingsMessages } from './web-settings';
import { webShellMessages } from './web-shell';
import { webToolsMessages } from './web-tools';
import { webUseCaseMessages } from './web-use-cases';
import { withoutBetaEnglishFallbacks } from '../beta-fallbacks';

/**
 * French is a beta interface locale. Legal, billing, and consent statements
 * intentionally stay out of this catalog until they have human translation
 * review. The translator falls back to the controlling English copy for them.
 */
export const fr = {
  ...navMessages,
  ...withoutBetaEnglishFallbacks(assistantMessages, 'fr'),
  ...withoutBetaEnglishFallbacks(assistantWebMessages, 'fr'),
  ...actionMessages,
  ...commonMessages,
  ...composerMessages,
  ...withoutBetaEnglishFallbacks(webComposerMessages, 'fr'),
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
  ...withoutBetaEnglishFallbacks(settingsMessages, 'fr'),
  ...developerMessages,
  ...digestMessages,
  ...withoutBetaEnglishFallbacks(authMessages, 'fr'),
  ...onboardingMessages,
  ...emailMessages,
  ...errorMessages,
  ...importMessages,
  ...mediaMessages,
  ...postingSetMessages,
  ...queueMessages,
  ...validationMessages,
  ...stateMessages,
  ...statusMessages,
  ...a11yMessages,
  ...webBlogMessages,
  ...webComparisonMessages,
  ...webDemoMessages,
  // The legal and price/trial sections are English fallback pending review.
  ...withoutBetaEnglishFallbacks(webMarketingMessages, 'fr'),
  ...webPlatformsMessages,
  ...withoutBetaEnglishFallbacks(webSettingsMessages, 'fr'),
  ...webShellMessages,
  ...webToolsMessages,
  ...webUseCaseMessages,
} as const;

/** Every message key in the product. */
export type MessageKey = keyof typeof fr;

/** A beta French catalog. The full English catalog remains the key source of truth. */
export type FrenchCatalog = typeof fr;

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
